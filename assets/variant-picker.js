class VariantPicker extends HTMLElement{
 constructor() {
  super();
  let variantPickers = document.getElementsByClassName('variant-picker__variant-input');
  let variantsQuantityInformation;
  if(variantPickers.length > 0){
    this.currentVariant=variantPickers[0].getAttribute('data-current-variant-id');
     this.updateUrl();
     this.quantityInput = document.querySelector('[id^="Quantity-"]');
     if(this.quantityInput){
       variantsQuantityInformation = JSON.parse(this.quantityInput.getAttribute('data-variants-stock'))
       this.variantsQuantityInformation = variantsQuantityInformation;
       this.variantPickers = Array.from(variantPickers);
       this.addEventListener();  
     }
  }
 } 

 addEventListener() {
  this.variantPickers.forEach(picker => {
   let variantAlt = picker.getAttribute('data-variant-alt');
   let variantSrc = picker.getAttribute('data-variant-src');

   picker.addEventListener('click', () => {
    this.handleBorderSelectedVariant(picker)
    this.handleFeautreImage(variantAlt, variantSrc);
    this.handleVariantImages(variantAlt);
    this.updateUrl(picker);
    if(this.quantityInput){
     this.handleQuantityInput(picker) 
    }
   });
  });
 }
 updateUrl(picker=null){
   if(picker != null){
   this.currentVariant=picker.value;
   if (this.currentVariant) {
    let currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('variant', this.currentVariant);
    window.history.pushState({}, '', currentUrl);
    }
   }else{
    if (this.currentVariant) {
    let currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('variant', this.currentVariant);
    window.history.pushState({}, '', currentUrl);
    }
   }
 }
 //set border bottom to selected variant
 handleBorderSelectedVariant(picker){
   if(this.variantPickers){
    this.variantPickers.forEach(element => {     
     const selectedVariant = element === picker;
     const parentElement = element.parentElement;

    if(selectedVariant){
      parentElement?.classList.add('variant-picker__chosen');
    } 
    else {
      parentElement?.classList.remove('variant-picker__chosen');
    }
   })
   } 
 }
 //set values to data-attributes of quantity input so it now works with selected variant
 handleQuantityInput(picker){
   let stockLimitParagraph = document.getElementById('stock-limit-text');
   let quantityPickerContainer =document.getElementById('quantity-picker-container');
   if(stockLimitParagraph && quantityPickerContainer){
     quantityPickerContainer.classList.add('u-center-vert');
     stockLimitParagraph.classList.add('u-hidden');
   }
   let variantId = picker.value;
   let result = this.variantsQuantityInformation.find(function(element) {
    return element.id == variantId;
   });
   
   if(result){
     this.quantityInput.value = result.quantity_for_user != 0 ? 1 : 0;
     this.quantityInput.setAttribute("data-variant-id", result.id);
     this.quantityInput.setAttribute("data-number-cart", result.quantity_cart);
     this.quantityInput.setAttribute("data-number", result.quantity_stock);
     this.quantityInput.setAttribute("data-variant-price", result.price);
     this.quantityInput.setAttribute("data-variant-compare-price", result.compare_at_price);
     this.quantityInput.dispatchEvent(new Event('change'));
   }
 }
//set feature image to be the image of the newly selected variant
 handleFeautreImage(alt,src){
  let currentFeatureMedia = document.getElementById("current-variant-feature-media")
  currentFeatureMedia.alt = alt;
  currentFeatureMedia.src = src;
 }

 //set product media images to show only images of the newly selected variatn
 handleVariantImages(alt) {
  var featuredMediaIndexChoosen = false;
  var productMediaList = document.getElementById("product-images");   
  let liElements = productMediaList.querySelectorAll("li");
  liElements.forEach(function(li,index) {
    var dataMediaAlt = li.getAttribute("data-media-alt");
    if(dataMediaAlt === alt && featuredMediaIndexChoosen == false){
      let img = li.querySelector('img'); 
      if (img) {
        img.classList.toggle('product-media-img-not-selected', false);
        img.classList.toggle('product-media-img-selected', true);
      }
      productMediaList.setAttribute("data-current-index", index);
      featuredMediaIndexChoosen = true;
    }
    else{
      let img = li.querySelector('img'); 
      if (img) {
       img.classList.toggle('product-media-img-not-selected', true);
       img.classList.toggle('product-media-img-selected', false);
      }
    }
    let shouldDisplay = dataMediaAlt === alt;
     li.classList.toggle('u-block', shouldDisplay);
     li.classList.toggle('product-images-slider__product-media-element-hidden', !shouldDisplay);
  });
}
}
customElements.define('variant-picker', VariantPicker);

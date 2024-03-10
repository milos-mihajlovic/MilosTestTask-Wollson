class QuantitySelector extends HTMLElement {
 constructor() {
  super();
  this.input = this.querySelector('input');
  this.changeEvent = new Event('change', { bubbles: true })
  this.querySelectorAll('button').forEach(
    (button) => button.addEventListener('click', this.onButtonClick.bind(this))
  );
 }

 onButtonClick(event) {
  event.preventDefault();
  if (this.input.disabled) return;
  const previousValue = this.input.value;

  event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
  if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
 }
}
customElements.define('quantity-selector', QuantitySelector);


class AddToCartForm extends HTMLElement{
 constructor() {
  super();
  this.quantitySelector=document.querySelector('.quantity input[type="number"]');
  this.selectedVariant;
  this.currentVariantPrice = this.quantitySelector.getAttribute('data-variant-price');
  this.currentVariantComparePrice = this.quantitySelector.getAttribute('data-variant-compare-price');
  this.currentOnStockNumber = parseInt(this.quantitySelector.getAttribute('data-number'));
  this.currentInCartNumber = parseInt(this.quantitySelector.getAttribute('data-number-cart'));
  this.currentAvailableForUser = this.currentOnStockNumber - this.currentInCartNumber;
  this.stockLimitParagraph = document.querySelector('[id^="stock-limit-text-"]');
  this.quantityPickerContainer = document.querySelector('[id^="quantity-picker-container-"]');
  this.addToCartButton = document.getElementById('addToCartButton');
  this.availableButtonText = addToCartButton.getAttribute('data-available-text');
  this.soldOutButtonText = addToCartButton.getAttribute('data-sold-out-text');
  if(parseInt(this.quantitySelector.value) == 0){
   this.addToCartButton.disabled = true;
  }
  else{
   this.addToCartButton.disabled = false;
  }
  this.addEventListener();  
 } 
  
 addEventListener() {
  if(this.quantitySelector){
  this.quantitySelector.addEventListener('change',()=> this.checkQuantityStock());
  if(this.addToCartButton){ 
   this.addToCartButton.addEventListener('click', () => this.handleAddToCart());
  }
  }
 }
  
  async handleAddToCart() {
  try {
   const selectedVariant = {
    id: this.quantitySelector.getAttribute('data-variant-id'),
    quantity: this.quantitySelector.value
   };
    
   const config = fetchConfig('json');
   config.headers['credentials'] = 'same-origin';
   config.headers['X-Requested-With'] = 'XMLHttpRequest';
   config.body = JSON.stringify(selectedVariant);
     
   const response = await fetch(`${routes.cart_add_url}.js`, config);
    if (!response.ok) {
     throw new Error('Failed to add item to cart');
    }
    const responseData = await response.json();
    if (responseData && responseData.error) {
     throw new Error(responseData.error);
    }
    window.location.href = '/cart';
  } 
  catch (error) {
   console.error('Error:', error.message);
   // display a message to the user 
  }
 }
  
 checkQuantityStock(){
  this.stockLimitParagraph.classList.add('u-hidden');
  this.quantityPickerContainer.classList.add('u-center-vert');
  this.quantityPickerContainer.classList.remove('u-decenter-vert');
   
  this.currentOnStockNumber = parseInt(this.quantitySelector.getAttribute('data-number'));
  this.currentInCartNumber = parseInt(this.quantitySelector.getAttribute('data-number-cart'));
  this.currentAvailableForUser = this.currentOnStockNumber - this.currentInCartNumber;
  this.currentVariantPrice = parseInt(this.quantitySelector.getAttribute('data-variant-price'));
  this.currentVariantComparePrice = parseInt(this.quantitySelector.getAttribute('data-variant-compare-price'));
  this.buyingButtonsAdjustments();
 }
  
 buyingButtonsAdjustments(){
  let value = parseInt(this.quantitySelector.value);  
   
  if(value == 1 && this.currentAvailableForUser == 0){
   value = 0;
   this.quantitySelector.value = 0;
  }
   
  //out of stock or unavailable for user due to his items in the cart
  if(value == 0 && this.currentAvailableForUser == 0){
   if(this.addToCartButton){
    this.disableAddToCartButtonSoldOut()
   }
  }
     
  //user tries to write number less than 1 in the input field
  else if(value < 1){
  let variantAvailable = this.currentAvailableForUser < 1 ? 0 : 1;
  this.quantitySelector.value = variantAvailable;
   if(this.addToCartButton){
    variantAvailable ? this.enableAddToCartButton() : this.disableAddToCartButtonSoldOut();
   }
  }
    
  //user tries to add more than available
  else if (value > this.currentAvailableForUser) {
  this.quantitySelector.value = this.currentOnStockNumber - this.currentInCartNumber; 
   if(this.addToCartButton){
    if(this.currentOnStockNumber == 0 || this.currentOnStockNumber - this.currentInCartNumber == 0){
     this.disableAddToCartButtonSoldOut()
    }
    else{
      this.stockLimitParagraph.classList.remove('u-hidden');
      this.quantityPickerContainer.classList.remove('u-center-vert');
      this.quantityPickerContainer.classList.add('u-decenter-vert');
     this.enableAddToCartButton()
    }
   }
  }
    
  else{
   if(this.addToCartButton){
    this.enableAddToCartButton();
   }
  }
 }

 enableAddToCartButton(){
  this.handleAddToCartText();
  this.addToCartButton.disabled = false;
 }
 disableAddToCartButtonSoldOut(){
  this.handleAddToCartText();
  this.addToCartButton.disabled = true;
 }


  handleAddToCartText(){
   if(this.currentAvailableForUser != 0){     
     this.addToCartButton.textContent = this.availableButtonText + " - " + Shopify.formatMoney(this.currentVariantPrice * this.quantitySelector.value);
     if(this.currentVariantComparePrice != 0){
       let spanElement = document.createElement('span');
       spanElement.textContent = Shopify.formatMoney(this.currentVariantComparePrice * this.quantitySelector.value);
       spanElement.style.color = '#B09F97';
       spanElement.style.textDecoration = 'line-through';
       spanElement.style.marginLeft = '3px';
       addToCartButton.appendChild(spanElement);
     }
   }
   else{
     this.addToCartButton.textContent = this.soldOutButtonText;
   }
 }


}
customElements.define('cart-form', AddToCartForm);

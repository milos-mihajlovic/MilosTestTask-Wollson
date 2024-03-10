class ProductImagesSlider extends HTMLElement{
 constructor() {
  super();
   this.allMediaUrls = [];
   this.productImagesElement = document.getElementById("product-images");     
   this.getAllImageSources();
   this.touchStartX = 0;
   this.touchEndX = 0;

   this.prevButton = this.querySelector('.product-images-slider__button--prev-btn');
   this.nextButton = this.querySelector('.product-images-slider__button--next-btn');
   
   this.currentVariantFeatureMedia=document.getElementById("current-variant-feature-media");
   
   this.currentIndex=parseInt(document.getElementById("product-images").getAttribute("data-current-index"));
   
   this.addEventListeners();
   this.updateBorder();
 } 

  //initially get all img sources needed for functions to perform
  getAllImageSources() {
  if(this.productImagesElement) {
   this.productImages = this.productImagesElement.querySelectorAll('img.product-images-slider__product-image');
    if(this.productImages){
      this.productImages.forEach(img => {
     this.allMediaUrls.push(img.getAttribute('src'));
    })
    }
   } 
  }

  addEventListeners(){
    this.productImages.forEach((image, index) => {
      image.addEventListener('click', () => {
        this.changeImage(this.allMediaUrls[index], '');
      });
    });
    if(this.prevButton) {
      this.prevButton.addEventListener('click', this.prevImage.bind(this));
    }
    if(this.nextButton) {
      this.nextButton.addEventListener('click', this.nextImage.bind(this));
    }
    this.currentVariantFeatureMedia.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
    this.currentVariantFeatureMedia.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
    this.currentVariantFeatureMedia.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
  }

   handleTouchStart(event) {
     this.touchStartX = event.touches[0].clientX;
    }
    handleTouchMove(event) {
      this.touchEndX = event.touches[0].clientX;
    }
    handleTouchEnd(event) {
    const threshold = 50; // distance you need to swipe in order to get this function to execute

    if(this.touchStartX && this.touchEndX && Math.abs(this.touchStartX - this.touchEndX) > threshold){
      if(this.touchStartX - this.touchEndX > threshold){
        this.nextImage();
      }else if (this.touchEndX - this.touchStartX > threshold){
        this.prevImage();
      }
    }
    this.touchStartX = 0;
    this.touchEndX = 0;
}
    
  changeImage(src, alt) {
   this.currentVariantFeatureMedia.classList.add('hide-slide')
   this.currentVariantFeatureMedia.classList.remove('show-slide')
   setTimeout(() => {
   this.currentVariantFeatureMedia.src = src;
   this.currentVariantFeatureMedia.alt = alt;
   this.currentIndex = this.allMediaUrls.findIndex(img => img === src);
   this.productImagesElement.setAttribute("data-current-index", this.currentIndex);
   this.updateBorder();
   this.currentVariantFeatureMedia.classList.add('show-slide')
     this.currentVariantFeatureMedia.classList.remove('hide-slide')
   }, 400); 
  }

  prevImage() {
    let newIndex = parseInt(document.getElementById("product-images").getAttribute("data-current-index"));
    do {
        newIndex = (newIndex - 1 + this.allMediaUrls.length) % this.allMediaUrls.length;
    } while (document.querySelectorAll('#product-images li')[newIndex].classList.contains("product-images-slider__product-media-element-hidden"));
    this.changeImage(this.allMediaUrls[newIndex], '');
  }

  nextImage() {
    let newIndex = parseInt(document.getElementById("product-images").getAttribute("data-current-index"));
    do {
      newIndex = (newIndex + 1) % this.allMediaUrls.length;
    } while (document.querySelectorAll('#product-images li')[newIndex].classList.contains("product-images-slider__product-media-element-hidden"));
    this.changeImage(this.allMediaUrls[newIndex], '');
  }

  //set border to the image (currently selected)
  updateBorder() {
    this.productImages.forEach((img, index) => {
      if (index === parseInt(document.getElementById("product-images").getAttribute("data-current-index"))) {
        img.classList.toggle('product-media-img-not-selected', false);
        img.classList.toggle('product-media-img-selected', true);
      } else {
        img.classList.toggle('product-media-img-not-selected', true);
        img.classList.toggle('product-media-img-selected', false);
      }
    });
  }
}
customElements.define('product-images-slider', ProductImagesSlider);
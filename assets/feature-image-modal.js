class ImageModal extends HTMLElement{
 constructor() {
  super();
  this.modal = this.querySelector(".modal");
  this.featureImage = document.getElementById("current-variant-feature-media");
  this.imageInModal = this.querySelector(".modal__content");
  this.closeIcon = this.querySelector(".modal__close");
  this.addEventListener();
 } 

 addEventListener() {
  if(this.featureImage) {
   this.featureImage.addEventListener('click', this.openModal.bind(this));
  }
  if(this.closeIcon) {
   this.closeIcon.addEventListener('click', this.closeModal.bind(this));
  }
 }
 closeModal(){
  this.modal.classList.remove("u-block");
  this.modal.classList.add("u-hidden");
  document.body.classList.remove("body--overflow-hidden");
  document.body.classList.add("body--overflow-auto");
 }
 openModal(){
  this.modal.classList.remove("u-hidden");
  this.modal.classList.add("u-block");
  this.imageInModal.src = this.featureImage.src;
   document.body.classList.add("body--overflow-hidden");
  document.body.classList.remove("body--overflow-auto");
 }
}
customElements.define('image-modal', ImageModal);

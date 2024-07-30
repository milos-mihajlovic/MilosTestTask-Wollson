import { Splide } from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';


class USP extends HTMLElement {
    constructor() {
        super();
        this.initialize = this.initialize.bind(this);
        document.addEventListener("DOMContentLoaded", this.initialize);
        window.addEventListener("resize", this.handleResize);
    }

    initialize() {
        this.Slider = this.querySelector(".wls-usp__carousel");
        if (this.Slider) {
            this.initSlider();
        }
    }

    handleResize() {
        if (this.Slider) {
            this.initSlider();
        }
    }

    initSlider() {
        let reverseAnimation = this.Slider.getAttribute("data-reverse") === "true";
        let stopAnimation = this.Slider.getAttribute("data-stop") === "true";

        if (!stopAnimation) {
            var splide = new Splide(this.Slider, {
                type: "loop",
                direction: reverseAnimation ? "rtl" : "ltr",
                drag: false,
                arrows: false,
                autoWidth: true,
                pauseOnHover: false,
                pagination: false,
                autoScroll: {
                    speed: 1,
                },
            });
            splide.mount({ AutoScroll });
        }
    }
}

customElements.define("wls-usp", USP);
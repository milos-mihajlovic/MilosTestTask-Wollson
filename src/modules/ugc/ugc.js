import Splide from "@splidejs/splide";

class UGC extends HTMLElement {
  constructor() {
    super();
    this.initialize = this.initialize.bind(this);
    this.handleResize = this.handleResize.bind(this);
    document.addEventListener("DOMContentLoaded", this.initialize);
    window.addEventListener("resize", this.handleResize);
  } 

  initialize() {
    this.ugcSlider = this.querySelector(".wls-ugc__carousel");
    if (this.ugcSlider) {
      this.initSlider();
      this.initVideoHandlers();
    }
  }

  handleResize() {
    if (this.ugcSlider) {
      this.initSlider();
    }
  }

  initSlider() {
    if (this.splideInstance) {
      this.splideInstance.destroy();
    }

    let enableOnDesktop =
      this.ugcSlider.getAttribute("data-desktop") === "true";
    let slidesDesktop = this.ugcSlider.getAttribute("data-slides-desktop");
    let gap_d = this.ugcSlider.getAttribute("data-gap");
    let gap_m = this.ugcSlider.getAttribute("data-gapm");

    // Base options
    let options = {
      pagination: false,
      arrows: false,
      type: "loop",
      gap: gap_m ? gap_m + "px" : "30px",
      perMove: 1,
      mediaQuery: "min",
      autoWidth: false,
      focus: "center",
      perPage: 1,
      breakpoints: {},
    };

    if (enableOnDesktop) {
      // Both mobile and desktop
      options.breakpoints = {
        768: {
          perPage: 2,
          gap: gap_d ? gap_d + "px" : "30px",
        },
        1024: {
          perPage: slidesDesktop ? slidesDesktop : 3,
          gap: gap_d ? gap_d + "px" : "35px",
        },
      };
    } else {
      // Mobile only
      options.breakpoints = {
        768: {
          destroy: "true",
        },
      };
    }
    this.splideInstance = new Splide(this.ugcSlider, options).mount();
  }

  // Function to pause all videos
  pauseAllVideos() {
    const videoGrpEls = this.querySelectorAll('[wls-video-playing="true"]');

    videoGrpEls.forEach((videoGrpEl) => {
      const videoEl = videoGrpEl.querySelector("video");

      videoEl.pause();
      videoGrpEl.setAttribute("wls-video-playing", false);
    });
  }

  // Initialize video handlers
  initVideoHandlers() {
    const videoGrpEls = this.querySelectorAll("[wls-video-playing]");

    videoGrpEls.forEach((videoGrpEl) => {
      const videoEl = videoGrpEl.querySelector("video");
      const btnEl = videoGrpEl.querySelector("[wls-video-play-btn]");

      btnEl.addEventListener("click", () => {
        this.pauseAllVideos();
        videoEl.play();
        videoGrpEl.setAttribute("wls-video-playing", true);
      });

      videoEl.addEventListener("click", () => {
        videoEl.pause();
        videoGrpEl.setAttribute("wls-video-playing", false);
      });
    });
  }
}

customElements.define("wls-ugc", UGC);
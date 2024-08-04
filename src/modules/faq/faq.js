class FAQ extends HTMLElement {
    constructor() {
        super();
        this.initializeAccordions = this.initializeAccordions.bind(this);
    }

    connectedCallback() {
        document.addEventListener("DOMContentLoaded", this.initializeAccordions);
    }

    initializeAccordions() {
        document.querySelectorAll(".wls-faq__question").forEach((item) => {
            item.addEventListener("click", () => this.toggleAccordion(item));
        });
    }

    toggleAccordion(item) {
        const answer = item.nextElementSibling;

        item.classList.toggle("active");

        if (answer.classList.contains("open")) {
            answer.classList.remove("open");
            answer.style.maxHeight = null;
        } else {
            answer.classList.add("open");
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    } 
}

customElements.define("faq-section", FAQ); 
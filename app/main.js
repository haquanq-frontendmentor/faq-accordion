const accordionButtons = document.querySelectorAll(".accordion__btn");
const accordionContents = document.querySelectorAll(".accordion__content");
const preferReducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

const transitionDuration = 300;

let preferReducedMotion = preferReducedMotionMedia.matches;

preferReducedMotionMedia.addEventListener("change", (e) => {
    preferReducedMotion = e.matches;
});

accordionContents.forEach((accordionContent, index) => {
    if (index > 0) {
        accordionContent.setAttribute("hidden", "");
        accordionButtons[index].setAttribute("aria-expanded", "false");
    }
});

accordionButtons.forEach((accordionButton, index) => {
    let requestingFrameId = null;
    const accordionContent = accordionContents[index];

    const hideContent = () => {
        accordionButton.setAttribute("aria-expanded", "false");
        if (preferReducedMotion) {
            accordionContent.setAttribute("hidden", "");
            return;
        }
        accordionContent.style.height = `${accordionContent.clientHeight}px`;
        accordionContent.style.transition = `height ${transitionDuration}ms ease`;

        if (requestingFrameId !== null) {
            cancelAnimationFrame(requestingFrameId);
            requestingFrameId = null;
        }
        requestAnimationFrame(() => {
            accordionContent.style.height = "0";

            let startCleanUpTime;
            const cleanUpRequest = (t) => {
                if (!startCleanUpTime) startCleanUpTime = t;
                if (t - startCleanUpTime >= transitionDuration) {
                    accordionContent.style.height = "";
                    accordionContent.style.transition = "";
                    accordionContent.setAttribute("hidden", "");
                    requestingFrameId = null;
                    return;
                }
                requestingFrameId = requestAnimationFrame(cleanUpRequest);
            };
            requestingFrameId = requestAnimationFrame(cleanUpRequest);
        });
    };

    const showContent = () => {
        accordionButton.setAttribute("aria-expanded", "true");
        accordionContent.removeAttribute("hidden");
        if (preferReducedMotion) return;

        const currentHeight = accordionContent.clientHeight;
        accordionContent.style.height = "auto";
        const targetHeight = accordionContent.clientHeight;

        if (requestingFrameId != null) {
            cancelAnimationFrame(requestingFrameId);
            requestingFrameId = null;
            accordionContent.style.height = `${currentHeight}px`;
        } else {
            accordionContent.style.height = "0";
        }

        requestAnimationFrame(() => {
            accordionContent.style.transition = `height ${transitionDuration}ms ease`;
            accordionContent.style.height = `${targetHeight}px`;

            let startCleanUpTime;
            const cleanUpRequest = (t) => {
                if (!startCleanUpTime) startCleanUpTime = t;
                if (t - startCleanUpTime >= transitionDuration) {
                    accordionContent.style.height = "";
                    accordionContent.style.transition = "";
                    requestingFrameId = null;
                    return;
                }
                requestingFrameId = requestAnimationFrame(cleanUpRequest);
            };
            requestingFrameId = requestAnimationFrame(cleanUpRequest);
        });
    };

    accordionButton.addEventListener("click", (e) => {
        const expanded = accordionButton.getAttribute("aria-expanded") === "true";
        if (expanded) hideContent();
        else showContent();
    });
});

const openMenuBtn = document.querySelector(".menu .burger-btn");
const closeMenuBtn = document.querySelector(".menu .close-btn");
const proceedBtn = document.querySelector(".proceed-btn");
const heroContent = document.querySelector(".hero-content");

if (proceedBtn) {
  gsap.from(proceedBtn, {
    opacity: 0,
    y: 18,
    duration: 0.8,
    ease: "power2.out",
    delay: 1.2,
  });

  proceedBtn.addEventListener("click", (e) => {
    // Allow normal browser behavior for new tab/window actions.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();

    const targetHref = proceedBtn.getAttribute("href") || "letters.html";

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        window.location.href = targetHref;
      },
    });

    if (heroContent) {
      tl.to(".proceed-btn", { scale: 0.96, duration: 0.18 }, 0);
      tl.to(heroContent, { opacity: 0, y: -22, duration: 0.6 }, 0.08);
    } else {
      tl.to(".proceed-btn", { opacity: 0, y: -12, duration: 0.45 }, 0);
    }
  });
}

const showMenu = gsap.timeline()
showMenu.to(".list-items", {
  x: "-100%",
  duration: 0.5,
  ease: "power1.out",
});
showMenu.pause();
openMenuBtn.addEventListener("click", () => {
  showMenu.play();
  openMenuBtn.style.display = "none";
  closeMenuBtn.style.display = "flex";

});
closeMenuBtn.addEventListener("click",()=>{
    showMenu.reverse()
    openMenuBtn.style.display = "flex";
    closeMenuBtn.style.display = "none";
})

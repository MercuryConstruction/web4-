function scrollTriggerLocomotive(){
    gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector(".page-wrapper"),
  smooth: true
});

// Add scroll listener to Locomotive instead of window
let lastScroll = 0;
locoScroll.on("scroll", (args) => {
    const currentScroll = args.scroll.y;
    
    if (currentScroll <= 0) {
        document.body.classList.remove("scroll-up");
        return;
    }
    
    if (currentScroll > lastScroll && !document.body.classList.contains('scroll-down')) {
        // Scrolling down
        document.body.classList.remove('scroll-up');
        document.body.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && document.body.classList.contains('scroll-down')) {
        // Scrolling up
        document.body.classList.remove('scroll-down');
        document.body.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".page-wrapper" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy(".page-wrapper", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector(".page-wrapper").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

}


function increaseNumber(){
    const numbers = document.querySelectorAll('.number');

    const updateCount = (el) => {
        const value = parseInt(el.getAttribute('data-value'));
        const increment = Math.ceil(value/100);
        let initialValue = 0;

        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const increasedCount = setInterval(() => {
                        initialValue += increment;
                        if(initialValue >= value) {
                            el.innerText = `${value}${el.getAttribute('data-value').includes('+') ? '+' : el.getAttribute('data-value').includes('%') ? '%' : el.getAttribute('data-value').includes('years') ? ' years' : ''}`;
                            clearInterval(increasedCount);
                            observer.unobserve(el);
                            return;
                        }
                        el.innerText = initialValue;
                    }, 70);
                }
            });
        }, {threshold: 0.6}); //start counting when 50% of viewport is visible


        // Start observing the element
        observer.observe(el);
    }

    numbers.forEach(item => updateCount(item));
}


function toogleNav(){
    const showMenu=(toggleId,menuId)=>{
        const toggle=document.getElementById(toggleId),
        menu=document.getElementById(menuId)
    
        toggle.addEventListener('click',function(){
            menu.classList.toggle('show-menu')
            toggle.classList.toggle('show-icon')
        })
    }
    
    showMenu('nav-toggle','nav-menu')
    
}




function metrices(){
    var div=document.querySelectorAll(".happy")
    div.forEach(function(e1){
        e1.addEventListener("mouseenter",()=>{
            e1.querySelector(".blue2").style.height=`100%`
            e1.children[0].style.color=`black`
            e1.children[1].style.color=`black`

        })
        e1.addEventListener("mouseleave",()=>{
            e1.querySelector(".blue2").style.height=`0%`
             e1.children[0].style.color=`white`
            e1.children[1].style.color=`white`
        })
   } )
   }



function fiterbaleImageGallery(){

    const filterButtons=document.querySelectorAll('.filter-button button');
    const images=document.querySelectorAll('.images-collection-filterable .card');

    filterButtons.forEach(button=>{
        button.addEventListener('click',()=>{
            const filterName=button.getAttribute('data-name');
            images.forEach(image=>{
                if(filterName==='all' || image.getAttribute('data-name')===filterName){
                    image.style.display='block';
                   
                }else{
                    image.style.display='none';
                    
                }
            })
            // Remove active class from all buttons first
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class only to clicked button
            button.classList.add('active');

        })
    })

}


function FAQ(){
    
const faqRightIcon = document.querySelectorAll('.FAQ-Question_Answer .FAQ-question .faq-right .icon');
const faqAnswer = document.querySelectorAll('.FAQ-Question_Answer .faq-answer');

faqRightIcon.forEach(function(elem, index){
    let isRotated = false;
    elem.addEventListener('click', function(){
        // Only toggle the corresponding answer
        const answer = faqAnswer[index];
        console.log(answer);
        if(!isRotated) {
            elem.style.transform = 'rotate(45deg)';
            isRotated = true;
            answer.style.display = 'block';
        } else {
            elem.style.transform = 'rotate(0deg)';
            isRotated = false;
            answer.style.display = 'none';
        }
    })
})
}



function formSubmission(){
    document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = document.getElementById('submit-btn');
    const loading = document.getElementById('loading');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Show loading state
    submitBtn.style.display = 'none';
    loading.style.display = 'block';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => {
        if (response.ok) {
            // Show success message
            loading.style.display = 'none';
            successMessage.style.display = 'block';
            form.reset(); // Clear the form
            setTimeout(() => {
                submitBtn.style.display = 'block';
                successMessage.style.display = 'none';
            }, 3000);
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        // Show error message
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
        setTimeout(() => {
            submitBtn.style.display = 'block';
            errorMessage.style.display = 'none';
        }, 3000);
    });
});
}


function headerUpDown(){
    const header=document.querySelector('.header')
    const locoScroll=new LocomotiveScroll({
        el:document.querySelector('.page-wrapper'),
        smooth:true
    })
}


function testimonials(){
    
// Testimonials Slider
document.addEventListener('DOMContentLoaded', function() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let currentIndex = 0;
    let interval;

    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active', 'prev', 'next');
            if (i < index) {
                card.classList.add('prev');
            } else if (i > index) {
                card.classList.add('next');
            }
        });
        testimonialCards[index].classList.add('active');
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        showTestimonial(currentIndex);
    }

    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentIndex);
    }

    // Auto-slide functionality
    function startAutoSlide() {
        interval = setInterval(nextTestimonial, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        clearInterval(interval);
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevTestimonial();
        stopAutoSlide();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        nextTestimonial();
        stopAutoSlide();
        startAutoSlide();
    });

    // Start auto-sliding
    startAutoSlide();

    // Pause auto-slide when hovering over testimonials
    document.querySelector('.testimonials-grid').addEventListener('mouseenter', stopAutoSlide);
    document.querySelector('.testimonials-grid').addEventListener('mouseleave', startAutoSlide);
});
}

function onClickButtonOfAboutHtmlScrollToLocation(){
window.onload = function() {
    if (window.location.hash === '#scrollToLocation') {
        document.querySelector('.location-form-container').scrollIntoView({ behavior: 'smooth' });
    }
};

}




toogleNav()
metrices()
scrollTriggerLocomotive()
fiterbaleImageGallery()
increaseNumber()
FAQ()
formSubmission()
headerUpDown()
testimonials()
onClickButtonOfAboutHtmlScrollToLocation()

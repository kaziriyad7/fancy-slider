const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const searchForm = document.getElementById("search-form");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
    imagesArea.style.display = "block";
    gallery.innerHTML = "";
    // show gallery title
    galleryHeader.style.display = "flex";
    images.forEach((image) => {
        let div = document.createElement("div");
        div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div);
    });
};

const getImages = (query) => {
    fetch(
        `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
    )
        .then((response) => response.json())
        .then((data) => {
            // the property name is invalid, it'll be hits

            if (data.hits.length <= 0) {
                const card = addCard(
                    "Sorry no image has been found with this parameter"
                );
                console.log(card);
                gallery.innerHTML = card;

                return;
            }
            showImages(data.hits);
        })
        .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    // 5. toggle class
    element.classList.toggle("added");

    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
    } else {
        // Pop images
        sliders.pop(img);
    }
};
var timer;
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert("Select at least 2 image.");
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = "";
    const prevNext = document.createElement("div");
    prevNext.className =
        "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = `
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext);
    document.querySelector(".main").style.display = "block";
    // hide image aria
    imagesArea.style.display = "none";

    // 2. Spelling mistake in html
    let duration = document.getElementById("duration").value || 1000;

    // 3. Fix - number logic
    if (duration <= 0) {
        duration = 1000;
    }

    sliders.forEach((slide) => {
        let item = document.createElement("div");
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item);
    });
    changeSlide(0);
    timer = setInterval(function () {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);
};

// change slider index
const changeItem = (index) => {
    changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
    const items = document.querySelectorAll(".slider-item");
    if (index < 0) {
        slideIndex = items.length - 1;
        index = slideIndex;
    }

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach((item) => {
        item.style.display = "none";
    });

    items[index].style.display = "block";
};

const eventMethod = (event) => {
    event.preventDefault();

    const loader = enableLoader();
    console.log(loader);
    gallery.appendChild(loader);

    // Enable Loader
    setTimeout(function () {
        document.querySelector(".main").style.display = "none";
        clearInterval(timer);
        const search = document.getElementById("search");
        getImages(search.value);
        sliders.length = 0;
    }, 1000);
};

// 4. Add enter feature
searchBtn.addEventListener("click", eventMethod, false);
searchForm.addEventListener("submit", eventMethod, false);

sliderBtn.addEventListener("click", function () {
    createSlider();
});

// Helper function for create card message
const addCard = (message) => {
    return `
        <div class="card">
            <div class="card-body text-center">
                <h2>${message}</h2>
            </div>
        </div>
    `;
};

// Helper function for enable loader
const enableLoader = () => {
    gallery.innerHTML = "";
    galleryHeader.style.display = "none";

    var loader = document.createElement("IMG");
    loader.setAttribute("src", "loader.gif");
    loader.setAttribute("alt", "Loader");
    loader.style.width = "128px";
    loader.style.height = "128px";

    //return loader;
};

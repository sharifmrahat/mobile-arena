//-------Getting element by ID----------------\\

const inputField = document.getElementById("input-field");
const alertMsg = document.getElementById("alert");
const spinner = document.getElementById("spinner");
const searchText = document.getElementById("search-text");
const searchResult = document.getElementById("search-result");
const modalBody = document.getElementById("modal-body");

//------------Alert Msg & Spinner hidden by default------------\\

alertMsg.style.display = "none";
spinner.setAttribute("hidden", true);

//-----------Click event handler on search button----------------\\

document.getElementById("search-btn").addEventListener("click", function () {
    const inputText = inputField.value;
    const url = `https://openapi.programming-hero.com/api/phones?search=${inputText}`;
    spinner.removeAttribute("hidden", true);
    alertMsg.style.display = "none";

    //---------Fetching API Data-----------\\
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            //------condition if search item not found--------\\
            if (data.status === false) {
                searchResult.innerHTML = "";
                alertMsg.style.display = "block";
                searchText.innerHTML = `"${inputField.value}"`;
                inputField.value = "";
                spinner.setAttribute("hidden", true);
            }
            //-------condition if item is found-----------\\
            else {
                inputField.value = "";
                alertMsg.style.display = "none";
                getPhones(data.data);
                spinner.setAttribute("hidden", true);
            }
        });
});

//---------Function call after data load from API------------\\
const getPhones = (items) => {
    searchResult.innerHTML = "";
    let allItems;
    if (items.length > 20) {
        allItems = items.slice(0, 20);
    } else {
        allItems = items;
    }
    // console.log("allItems: ", allItems);

    //-------Loop through each item and set innerHTML for div>card----------\\
    allItems.forEach((phone) => {
        // console.log(phone)

        const div = document.createElement("div");
        div.classList.add("col");
        div.innerHTML = `
    <div class="card text-center shadow">
    <img src="${phone.image}" class="card-img-top image-fluid w-50 mx-auto pt-4" alt="">
    <div class="card-body mb-3">
        <h4 class="card-title text-imperial fw-bold">${phone.phone_name}</h4>
        <h5 class="card-text text-muted fs-4">${phone.brand}</h5>

    </div>
    <div class="mb-4">
        <button onclick="getDetails('${phone.slug}')" class="btn bg-amour text-light fs-5 fw-bold" data-bs-toggle="modal"
            data-bs-target="#cardModal">Details</button>
    </div>

</div>
    `;
        searchResult.appendChild(div);
    });
};

//-------Reload data and getting details after clicking button---------\\
const getDetails = (phoneId) => {
    const slugUrl = `https://openapi.programming-hero.com/api/phone/${phoneId}`;

    //-----fetching data for individual item----------\\

    fetch(slugUrl)
        .then((res) => res.json())
        .then((data) => showDetails(data.data));
};

const showDetails = (phone) => {
    console.log(phone.others);
    modalBody.innerHTML = `
            <div class="col-md-4 ">
                    <img src="${phone.image}"
                    class="img-fluid h-100 w-100 " alt="">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h4 class="card-title text-amour fw-bold">${phone.name}</h3>
                    <p><b>Brand: </b>${phone.brand}</p>
                    <p><b>Release Date: </b>${phone.releaseDate || "Release date is unknown"}</p>
                    <p><b>Specification: </b>Display: ${phone.mainFeatures.displaySize}, Memory: ${phone.mainFeatures.memory}, Storage: ${phone.mainFeatures.storage}, Chipset: ${phone.mainFeatures.chipSet}.</p>
                    <p><b>Sensors: </b>${phone.mainFeatures.sensors}</p>
                    <p><b>Others: </b>${phone.others.Bluetooth}</p>
                </div>
            </div>`;
};
//data
const data = [
  {
    id: 1,
    name: "Dress&men",
    img: "https://m.media-amazon.com/images/I/71e04Q53xlL._AC_UY879_.jpg",
    price: 74,
    cat: "Dress",
    gender: "men",
    link: "https://www.youtube.com/channel/UCX3wGanw5AzILIaOdPFAu2g"
  },
  {
    id: 11,
    name: "Dress&men",
    img: "https://m.media-amazon.com/images/I/71e04Q53xlL._AC_UY879_.jpg",
    price: 74,
    cat: "Dress",
    gender:"men",
  },
  {
    id: 2,
    name: "Sport&men",
    img: "https://m.media-amazon.com/images/I/91WvnZ1g40L._AC_UY879_.jpg",
    price: 40,
    cat: "Sport",
    gender:"men",
  },
  {
    id: 3,
    name: "Dress&woman",
    img: "https://m.media-amazon.com/images/I/61hGDiWBU8L._AC_UY879_.jpg",
    price: 200,
    cat: "Dress",
    gender:"woman",
  },
  {
    id: 4,
    name: "Sport&woman",
    img: "https://m.media-amazon.com/images/I/51Nk5SEBARL._AC_UY879_.jpg",
    price: 16,
    cat: "Sport",
    gender:"woman",
  },
  {
    id: 5,
    name: "Casual&woman",
    img: "https://m.media-amazon.com/images/I/51kyjYuOZhL._AC_SL1000_.jpg",
    price: 74,
    cat: "Casual",
    gender:"woman",
  },
];

//set parameters
const productsContainer = document.querySelector(".products");
const searchInput = document.querySelector(".search");
const transportationContainer = document.querySelector(".transportations");
const activityContainer = document.querySelector(".activities");
//const priceRange = document.querySelector(".priceRange");
//const priceValue = document.querySelector(".priceValue");

//function to display products 
const displayProducts = (filteredProducts) => {
  productsContainer.innerHTML = filteredProducts
    .map(
      (product) =>
        `
       <div class="product">
          <a href=${product.link} target="_blank">
          <img
          src=${product.img}
          alt=""
          />
          </a>

          <span class="name">${product.name}</span>
          <span class="priceText">$${product.price}</span>
          <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
    `
    )
    .join("");
};

//search by text
/*searchInput.addEventListener("keyup", (e) => {
  const value = e.target.value.toLowerCase();

  if (value) {
    displayProducts(
      data.filter((item) => item.name.toLowerCase().indexOf(value) !== -1)
    );
  } else {
    displayProducts(data);
  }
});*/

//set category
const setCategories = () => {
  const alltransportation = data.map((item) => item.cat);
  const categories = [
    /*"All",
    */...alltransportation.filter((item, i) => {
      return alltransportation.indexOf(item) === i;
    }),
  ];

  transportationContainer.innerHTML = categories
    .map(
      (cat) =>
        `
      <button class="cat-option" data-value="${cat}">${cat}</button>
    `
    )
    .join("");

  // transportationContainer.addEventListener("click", (e) => {
  //   const selectedCat = e.target.textContent;

  //   selectedCat === "All"
  //     ? displayProducts(data)
  //     : displayProducts(data.filter((item) => item.cat === selectedCat));
  // });
};

//set gender
const setGenders = () => {
  const allGenders = data.map((item) => item.gender);
  const genders = [
    /*"All",
    */...allGenders.filter((item, i) => {
      return allGenders.indexOf(item) === i;
    }),
  ];

  activityContainer.innerHTML = genders
    .map(
      (gender) =>
      //<span class="gender">${gender}</span>
        `
      <button class="gender-option" data-value="${gender}">${gender}</button>
    `
    )
    .join("");

    // genderContainer.addEventListener("click", (e) => {
    //   const selectedGender = e.target.textContent;

    //   selectedGender === "All"
    //     ? displayProducts(data)
    //     : displayProducts(data.filter((item) => item.gender === selectedGender));
    // });
};

//Search by filters
function updateFilters() {
  const selectedCategories = [];
  document.querySelectorAll(".cat-option.active").forEach((option) => {
    selectedCategories.push(option.dataset.value); // Assuming you store the category value in a `data-value` attribute
  });

  const selectedGenders = [];
  document.querySelectorAll(".gender-option.active").forEach((option) => {
    selectedGenders.push(option.dataset.value); 
  });

  const filteredData = data.filter((item) => {
    // Filter based on category (if any selected)
    const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(item.cat) : true;

    // Filter based on gender (if any selected)
    const genderMatch = selectedGenders.length > 0 ? selectedGenders.includes(item.gender) : true;

    // Show items matching any selected category or gender (or both)
    return categoryMatch && genderMatch;
  });

  displayProducts(filteredData);

  // Update addToCartButtons after filtering
  let itemsInCart = []; // Array to store product IDs
  const updatedAddToCartButtons = document.querySelectorAll('.add-to-cart');
  updatedAddToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.productId; // Get product ID from button
      itemsInCart.push(productId); // Add product ID to cart array
      cartItems.textContent = itemsInCart.length; // Update item count
      console.log(itemsInCart)
    });
  });
}

//set user's options
const userOptions = () => {
  
  // Get references to all category and gender options
  const catOptions = document.querySelectorAll(".cat-option");
  const genderOptions = document.querySelectorAll(".gender-option");

  // Add event listeners to category options
  catOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Toggle "active" class on the clicked option
      option.classList.toggle("active");

      // Update filters based on selected options
      updateFilters();
    });
  });

  // Add event listeners to gender options
  genderOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Toggle "active" class on the clicked option
      option.classList.toggle("active");

      // Update filters based on selected options
      updateFilters();
    });
  });
};

//Render 
displayProducts(data);
setCategories();
setGenders();
userOptions();


//cart
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItems = document.querySelector('.cart-items');

let itemsInCart = []; // Array to store product IDs

addToCartButtons.forEach(button => {
  button.addEventListener('click', function() {
    const productId = this.dataset.productId; // Get product ID from button
    itemsInCart.push(productId); // Add product ID to cart array
    cartItems.textContent = itemsInCart.length; // Update item count
  });
});

//set price and search by price
/*const setPrices = () => {
  const priceList = data.map((item) => item.price);
  const minPrice = Math.min(...priceList);
  const maxPrice = Math.max(...priceList);

  priceRange.min = minPrice;
  priceRange.max = maxPrice;
  priceRange.value = maxPrice;
  priceValue.textContent = "$" + maxPrice;

  priceRange.addEventListener("input", (e) => {
    priceValue.textContent = "$" + e.target.value;
    displayProducts(data.filter((item) => item.price <= e.target.value));
  });
};*/



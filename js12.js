class User {
  constructor(data) {
    this.data = {
      id: data.id,
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
    };
  }
  edit(obj) {
    (this.data.id = obj.id),
      (this.data.name = obj.name),
      (this.data.email = obj.email),
      (this.data.address = obj.address),
      (this.data.phone = obj.phone);
  }
  get() {
    return this.data;
  }
}

class Contacts {
  constructor() {
    this.data = [];
  }
  add(contact) {
    this.data.push(contact);
  }
  edit(id, obj) {
    this.data.map((item) => (item.get().id === id ? item.edit(obj) : item));
  }
  remove(id) {
    this.data.map((item, index, arr) =>
      arr[index].get().id === id ? arr.splice(index, 1) : item
    );
  }
  get() {
    return this.data;
  }
}

class ContactsApp extends Contacts {
  constructor() {
    super();
    this.app = document.createElement("div");
    this.app.classList.add("contacts");
    document.body.append(this.app);
    this.app.innerHTML = `  <h3 class="title">Contacts</h3>
    <form action="#" class="add__contact">
      <fieldset class="contact">
        <legend class="title__form">Add contact</legend>
        <div class="contact__name">
          <label for="name"> Name</label>
          <input
            type="text"
            id="name"
            minlength="2"
            maxlength="15"
            placeholder="Your name"
          />
        </div>
        <div class="contact__email">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="example@gmail.com" />
        </div>
        <div class="contact__address">
          <label for="address">Address</label>
          <input
            type="text"
            id="address"
            minlength="2"
            maxlength="15"
            placeholder="Your city"
          />
        </div>
        <div class="contact__phone">
          <label for="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            maxlength="20"
            placeholder="+375(xx)-xxx-xx-xx"
          />
        </div>

        <button type="button" class="btn btn--show">Show contacts</button>
        <div class="buttons">
          <button type="button" class="btn btn--add">Add</button>
          <button type="button" class="btn btn--save">Save</button>
          <button type="button" class="btn btn--edit">Edit</button>
          <button type="button" class="btn btn--delete">Delete</button>
        </div>
      </fieldset>
    </form>
    <div class="contacts__list hidden">
    <button class="btn btn--back">back</button>
   </div>
    `;
    this.btnShow = document.querySelector(".btn--show");
    this.btnAdd = document.querySelector(".btn--add");
    this.btnSave = document.querySelector(".btn--save");
    this.btnEdit = document.querySelector(".btn--edit");
    this.btnDelete = document.querySelector(".btn--delete");
    this.btnBack = document.querySelector(".btn--back");
    this.contactList = document.querySelector(".contacts__list");
    this.nameValue = document.querySelector("#name");
    this.emailValue = document.querySelector("#email");
    this.addressValue = document.querySelector("#address");
    this.phoneValue = document.querySelector("#phone");

    this.btnSave.classList.add("hidden");

    this.onAdd = this.onAdd.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.get = this.get.bind(this);

    this.btnShow.addEventListener("click", this.get);
    this.btnAdd.addEventListener("click", this.onAdd);
    this.btnEdit.addEventListener("click", this.onEdit);
    this.btnDelete.addEventListener("click", this.onRemove);

    this.cookieName = "storageExpiration";
    this.cookieValue = new Date(Date.now() + 864000000).toUTCString();
    if (!this.getCookie(this.cookieName)) {
      window.localStorage.clear();
    }

    if (this.data === null || this.storage === null) {
      this.getData();
      this.fakeAPI();
    }
  }

  getCookie(name) {
    let matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  onAdd() {
    document.querySelectorAll(".contact__info").forEach((item) => {
      item.remove();
    });
    for (let i = 0; i < this.contactList.children.length; i++) {
      this.user = new User({
        id: i + 1,
        name: this.nameValue.value,
        email: this.emailValue.value,
        address: this.addressValue.value,
        phone: this.phoneValue.value,
      });
    }
    if (
      this.nameValue.value === "" ||
      this.emailValue.value === "" ||
      this.addressValue.value === "" ||
      this.phoneValue.value === ""
    ) {
      return;
    }

    super.add(this.user);
    this.storage = this.data;
    document.cookie = `${this.cookieName}=${this.cookieValue};  max-age=864000`;
    localStorage.removeItem("fakeAPI");

    this.item = document.createElement("li");
    this.item.classList.add("contact__info");
    this.item.innerHTML = `<div class="id">Id:${this.user.get().id}</div>
    <div class="name">Name: ${this.user.get().name}</div>
    <div class="email">Email: ${this.user.get().email}</div>
    <div class="address">Address: ${this.user.get().address}</div>
    <div class="phone">Phone: ${this.user.get().phone}</div>
      `;
    this.contactList.append(this.item);
    this.nameValue.value = "";
    this.emailValue.value = "";
    this.addressValue.value = "";
    this.phoneValue.value = "";
  }

  onEdit(event) {
    event.preventDefault();
    this.btnAdd.classList.add("hidden");
    this.btnSave.classList.remove("hidden");
    this.btnDelete.classList.add("hidden");

    let answerEdit = +prompt("Enter id number");
    if (this.data.length < answerEdit || answerEdit == false) {
      alert("Id does not exist");
      this.btnAdd.classList.remove("hidden");
      this.btnSave.classList.add("hidden");
      this.btnDelete.classList.remove("hidden");
    }
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].get().id === answerEdit) {
        this.nameValue.value = this.data[i].get().name;
        this.emailValue.value = this.data[i].get().email;
        this.addressValue.value = this.data[i].get().address;
        this.phoneValue.value = this.data[i].get().phone;

        this.btnSave.addEventListener("click", () => {
          super.edit(this.data[i].get().id, {
            id: this.data[i].get().id,
            name: this.nameValue.value,
            email: this.emailValue.value,
            address: this.addressValue.value,
            phone: this.phoneValue.value,
          });

          this.storage = this.data;
          document.cookie = `${this.cookieName}=${this.cookieValue}; max-age=864000`;

          document.querySelectorAll(".contact__info")[i].innerHTML = `
          <div class="id">Id:${this.data[i].get().id}</div>
          <div class="name">Name: ${this.nameValue.value}</div>
          <div class="email">Email: ${this.emailValue.value}</div>
          <div class="address">Address: ${this.addressValue.value}</div>
          <div class="phone">Phone: ${this.phoneValue.value}</div>
            `;

          this.nameValue.value = "";
          this.emailValue.value = "";
          this.addressValue.value = "";
          this.phoneValue.value = "";

          this.btnSave.classList.add("hidden");
          this.btnAdd.classList.remove("hidden");
          this.btnDelete.classList.remove("hidden");
        });
      }
    }
  }

  onRemove() {
    if (this.data.length === 0) return alert("List is empty");
    let answer = +prompt("Enter id number");
    if (this.data.length < answer) return alert("Id does not exist");
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].get().id === answer) {
        super.remove(this.data[i].get().id);
        this.storage = this.data;
        document.cookie = `${this.cookieName}=${this.cookieValue};  max-age=864000`;
        document.querySelectorAll(".contact__info")[i].remove();
      }
    }
  }

  get() {
    super.get();
    this.contactList.classList.remove("hidden");

    this.btnBack.addEventListener("click", () => {
      this.contactList.classList.add("hidden");
    });
  }

  async getData() {
    const url = "https://jsonplaceholder.typicode.com/users";
    let response = await fetch(url);

    let data = await response.json();
    localStorage.setItem("fakeAPI", JSON.stringify(data));
    return data;
  }
  fakeAPI() {
    let fake = localStorage.getItem("fakeAPI");
    const fakeData = JSON.parse(fake);
    console.log(fakeData);
    for (let i = 0; i < fakeData.length; i++) {
      document.cookie = `${this.cookieName}=${this.cookieValue};  max-age=864000`;

      this.fakeItem = document.createElement("li");
      this.fakeItem.classList.add("contact__info");
      this.fakeItem.innerHTML = `<div class="id">Id:${fakeData[i].id}</div>
      <div class="name">Name: ${fakeData[i].name}</div>
      <div class="email">Email: ${fakeData[i].email}</div>
      <div class="address">Address: ${fakeData[i].address.city}</div>
      <div class="phone">Phone: ${fakeData[i].phone}</div>
        `;
      this.contactList.append(this.fakeItem);
    }
  }

  get storage() {
    return localStorage.getItem("contactsData");
  }

  set storage(value) {
    localStorage.setItem("contactsData", JSON.stringify(value));
  }
}
let contactsApp = new ContactsApp();

// dom mainbulation
const liNodeSize = document.querySelectorAll(".controled-size li")
const liSize = Array.from(liNodeSize)
const registerForm = document.getElementById("register-form")
const emailInput = document.getElementById("emailInput")
const passwordInput = document.getElementById("passwordInput")
const repeatPasswordInput = document.getElementById("repeatPasswordInput")
// vars
let initialPageSize: string | null = "medium"

// ==================================================================================
// --------------- Events ---------------------------------------------------------
// ==================================================================================
window.addEventListener("load", windowLoaded)
registerForm?.addEventListener('submit', submitForm)
emailInput?.addEventListener('blur', validateEmail)
emailInput?.addEventListener("keyup", validateEmail)
passwordInput?.addEventListener("blur", validatePassword)
passwordInput?.addEventListener("keyup", revalidateRepeatPassword)
repeatPasswordInput?.addEventListener("blur", validateRepeatPAssword)
repeatPasswordInput?.addEventListener("keyup", validateRepeatPAssword)


liSize?.forEach((tag) => {
  tag.addEventListener("click", (event) => {
    const currentElement = event?.target as HTMLLIElement
    const dataSize = currentElement?.getAttribute("data-target-size")

    //  remove class active from all
    liSize?.forEach((tag) => tag.classList.remove("active"))

    // add active to selected one
    currentElement?.classList.add("active")

    // switch to change size
    renderPageSize(dataSize)
  })
})

// ==================================================================================
// --------------- functions ---------------------------------------------------------
// ==================================================================================
function windowLoaded() {
   if (window.localStorage && localStorage.getItem("size")) {
     initialPageSize = window.localStorage.getItem("size")
   }

   renderPageSize(initialPageSize)
   renderActiveSizeLi(initialPageSize)
}

function renderPageSize(size: string | null) {
  switch (size) {
    case "small":
      {
        document.body.style.fontSize = "12px"
        window.localStorage.setItem("size", "small")
      }
      break
    case "large":
      {
        document.body.style.fontSize = "18px"
        window.localStorage.setItem("size", "large")
      }
      break
    default: {
      document.body.style.fontSize = "14px"
      window.localStorage.setItem("size", "medium")
    }
  }
}

function renderActiveSizeLi(initialSize: string | null) {
  liSize.forEach((tag) => {
    const dataSize = tag?.getAttribute("data-target-size")
    if (dataSize?.trim() === initialSize?.trim()) {
      tag.classList.add("active")
    }
  })
}

// validate email
function isEmail(emailAdress: string) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  if (emailAdress.match(regex)) return true
  else return false
}

function submitForm(event: Event) {
  event && event.preventDefault()

  const onlyInputs = document.querySelectorAll("#register-form input")

   onlyInputs.forEach(input => {
      const value = (input as HTMLInputElement)?.value
      // console.log();
      if (!value) {
         input.classList.add('is-invalid')
      }
   });

}

function validateEmail(event: Event) {
   const currentElement = event && (event?.target as HTMLInputElement)
   const value = currentElement.value.trim().toLowerCase()

   // Test if email is valid
   if (!isEmail(value)) {
     currentElement.classList.remove("is-invalid")
     currentElement.classList.add("is-invalid")
   } else {
     currentElement.classList.remove("is-invalid")
     currentElement.classList.add("is-valid")
   }
}

function validatePassword(event: Event) {
  const currentElement = event && (event?.target as HTMLInputElement)
  const value = currentElement.value.trim().toLowerCase()
  const repeatedPasswordValue = (
    repeatPasswordInput as HTMLInputElement
  ).value.trim()

  if (!value.trim()) {
    currentElement.classList.remove("is-valid")
    currentElement.classList.add("is-invalid")
  } else {
    currentElement.classList.remove("is-invalid")
    currentElement.classList.add("is-valid")
  }
}

function validateRepeatPAssword(event: Event) {
  const currentElement = event && (event?.target as HTMLInputElement)
  const value = currentElement.value.trim().toLowerCase()

  if (!value.trim()) {
    currentElement.classList.remove("is-valid")
    currentElement.classList.add("is-invalid")
  } else {
    currentElement.classList.remove("is-invalid")
    currentElement.classList.add("is-valid")

    if (value.trim() !== (passwordInput as HTMLInputElement)?.value?.trim()) {
      currentElement.classList.remove("is-valid")
      currentElement.classList.add("is-invalid")
    } else {
      currentElement.classList.remove("is-invalid")
      currentElement.classList.add("is-valid")
    }
  }
}

function revalidateRepeatPassword(event: Event) {
  const currentElement = event && (event?.target as HTMLInputElement)
  const repeatedPasswordValue = (
    repeatPasswordInput as HTMLInputElement
  ).value.trim()

  if (repeatedPasswordValue && repeatedPasswordValue.length > 0) {
    if (currentElement?.value.trim() !== repeatedPasswordValue) {
      repeatPasswordInput?.classList.remove("is-valid")
      repeatPasswordInput?.classList.add("is-invalid")
    }
  }
}
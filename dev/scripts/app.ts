// $(function () {
//   var $win = $(window),
//     $doc = $(document),
//     $body = $(document.body),
//     $liSize = $(".controled-size li"),
//     $registerForm = $("#register-form"),
//     $emailInput = $("#emailInput"),
//     $passwordInput = $("#passwordInput"),
//     $repeatPasswordInput = $("#repeatPasswordInput"),
//     initialPageSize: string | null = "medium"

//   ////////////////////////////////////////////////////////////////////////////////////
//   ///////// Events ////////////////////////////////////////////////////////////
//   ////////////////////////////////////////////////////////////////////////////////////
//   $win.on("load", windowLoaded)
//   $liSize.on("click", addjustPageSize)

//   ////////////////////////////////////////////////////////////////////////////////////
//   ///////// functions ////////////////////////////////////////////////////////////
//   ////////////////////////////////////////////////////////////////////////////////////
//   function windowLoaded() {
//     if (window.localStorage && localStorage.getItem("size")) {
//       initialPageSize = window.localStorage.getItem("size")
//     }

//     console.log("initialPageSize: ", initialPageSize)

//     renderPageSize(initialPageSize)
//     renderActiveSizeLi(initialPageSize)
//   }

//   function addjustPageSize(event: Event) {
//     const $currentElement = $(event?.target as HTMLLIElement)
//     const dataSize = $currentElement?.attr("data-target-size") || null

//     //  remove class active from all
//     $liSize?.removeClass("active")

//     // add active to selected one
//     $currentElement?.addClass("active")

//     // switch to change size
//     renderPageSize(dataSize)
//   }

//   function renderPageSize(size: string | null) {
//     switch (size) {
//       case "small":
//         {
//           $body.css({ "font-size": "12px" })
//           window.localStorage.setItem("size", "small")
//         }
//         break
//       case "large":
//         {
//           $body.css({ "font-size": "18px" })
//           window.localStorage.setItem("size", "large")
//         }
//         break
//       default: {
//         $body.css({ "font-size": "14px" })
//         window.localStorage.setItem("size", "medium")
//       }
//     }
//   }

//   function renderActiveSizeLi(initialSize: string | null) {
//     $liSize.each((_index, element) => {
//       const dataSize = $(element)?.attr("data-target-size")
//       if (dataSize?.trim() === initialSize?.trim()) {
//         $(element).addClass("active")
//       }
//     })
//   }
// })

const appSize = (function () {
  const $body = $(document.body);
  let initialPageSize: string | null = "medium"

  const onWindowLoaded = (_event: Event, lisElements: JQuery<HTMLElement>) => {
    if (window.localStorage && localStorage.getItem("size")) {
      initialPageSize = window.localStorage.getItem("size")
    }

    renderPageSize(initialPageSize)
    renderActiveSizeLi(initialPageSize, lisElements)
  }

  const addjustPageSize = (currentElement) => {
    console.log("currentElement:inside: ", currentElement)
    //  const $currentElement = $(event?.target as HTMLLIElement)
    const dataSize = currentElement?.attr("data-target-size") || null
    // add active to selected one
    currentElement?.addClass("active")

    // switch to change size
    renderPageSize(dataSize)
  }

  const renderPageSize = (size: string | null) => {
    switch (size) {
      case "small":
        {
          $body.css({ "font-size": "12px" })
          window.localStorage.setItem("size", "small")
        }
        break
      case "large":
        {
          $body.css({ "font-size": "18px" })
          window.localStorage.setItem("size", "large")
        }
        break
      default: {
        $body.css({ "font-size": "14px" })
        window.localStorage.setItem("size", "medium")
      }
    }
  }

  const renderActiveSizeLi = (
    initialSize: string | null,
    elements: JQuery<HTMLElement>
  ) => {
    elements.each((_index, element) => {
      const dataSize = $(element)?.attr("data-target-size")
      if (dataSize?.trim() === initialSize?.trim()) {
        $(element).addClass("active")
      }
    })
  }

  return {
    initialPageSize,
    addjustPageSize,
    onWindowLoaded
  }
})();


const appTheme = (function () {
  let isTriggerChecked: boolean|null = false 

  const onwindowLoaded = ($trigger, $docElement: JQuery<HTMLElement>) => {
    if (window.localStorage) {
      const modeValue = localStorage.getItem("mode")
      $docElement.attr("data-mode", modeValue ? modeValue : "light")
      $trigger.attr("checked", (modeValue && modeValue === "dark") || false)
    } else {
      $docElement.attr("data-mode", "light")
      $trigger.attr("checked", false)
    }
  }

  const toggleTheme = (
    event: Event,
    $docElement: JQuery<HTMLElement>
  ) => {
    const isChecked = $(event.target as HTMLInputElement).is(":checked")
    $docElement.attr("data-mode", isChecked ? "dark" : "light")
    window.localStorage.setItem("mode", isChecked ? "dark" : "light")
  }

  return {
    onwindowLoaded,
    toggleTheme
  }
})()

const inputValidator = (function () {
  let isValid: boolean = false
  let isValidEmail: boolean = false 
  let isValidPassword: boolean = false 
  let isValidConfirmPassword: boolean = false 

  const renderFeedbackVisible = ($element: JQuery<HTMLElement>, message: string|undefined) => {
    if ($element.next(".invalid-feedback").length > 0) {
      $element.next(".invalid-feedback").html(`<small>${message}</small>`)
    } else {
      $element
        .closest("div")
        .append(`<div class="invalid-feedback"><small>${message}</small></div>`)
    }
  }

  const validateRequiredFiled = (
    $field: JQuery<HTMLElement>,
    options: {
      validatorMsg?: string
    }
  ) => {
    if (!$field || $field?.val() === "") {
      isValid = false
      $field.removeClass("is-valid").addClass("is-invalid")
      renderFeedbackVisible($field, options.validatorMsg)
    }else {
      isValid = true
      $field
        .removeClass("is-invalid")
        .addClass("is-valid")
        .parent("div")
        .find(".invalid-feedback")
        .remove()
    }
  }

  const validateEmail = (
    $field: JQuery<HTMLElement>,
    options: { validatorMsg?: string }
  ) => {
    if (!$field.val()) return

    let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/
    let val = $field.val() as string

    if (val && regex.test(val)) {
      isValidEmail = true
      $field
        .removeClass("is-invalid")
        .addClass("is-valid")
        .parent("div")
        .find(".invalid-feedback")
        .remove()

      // emailError = true
    } else {
      isValidEmail = false
      $field.removeClass("is-valid").addClass("is-invalid")
      renderFeedbackVisible($field, options.validatorMsg)
    }
  }

  const validatePasswordField = (
    $field: JQuery<HTMLElement>,
    options: { validatorMsg?: string; $matcherField: JQuery<HTMLElement> }
  ) => {
    const value = $field.val() as string 
    const matcherValue = options?.$matcherField.val() as string

    if (matcherValue.trim().length == 0) return
       

    if (
      matcherValue.length > 0 &&
      $.trim(matcherValue).toLowerCase() !== $.trim(value).toLowerCase()
    ) {
      options?.$matcherField.removeClass("is-valid").addClass("is-invalid")
      renderFeedbackVisible(options?.$matcherField, options.validatorMsg)
    } else {
      options?.$matcherField
        .removeClass("is-invalid")
        .addClass("is-valid")
        .parent("div")
        .find(".invalid-feedback")
        .remove()
    }
  }

  const validateRepeatPasswordFiled = (
    $field: JQuery<HTMLElement>,
    options: { validatorMsg?: string; $matcherField: JQuery<HTMLElement> }
  ) => {    
    const repeatPassVal = $field.val() as string 
    const matcherVal = options.$matcherField?.val() as string
    if (!repeatPassVal) return 

    if ($.trim(repeatPassVal).toLowerCase() !== $.trim(matcherVal).toLowerCase()) {
      isValidConfirmPassword = false
      $field.removeClass("is-valid").addClass("is-invalid")
      renderFeedbackVisible($field, options.validatorMsg)
    }else {
      isValidConfirmPassword = true
      $field
        .removeClass("is-invalid")
        .addClass("is-valid")
        .parent("div")
        .find(".invalid-feedback")
        .remove()
    }
  }

  return {
    isValid,
    isValidEmail,
    validateRequiredFiled,
    validateEmail,
    validatePasswordField,
    validateRepeatPasswordFiled
  }
})()



// start doucment load login for jQuuer -================================
$(function () {
  var $win = $(window),
    $docElement = $(document.documentElement),
    $liSize = $(".controled-size li"),
    $form = $("#register-form"),
    $emailInput = $("#emailInput"),
    $passwordInput = $("#passwordInput"),
    $repeatPasswordInput = $("#repeatPasswordInput"),
    $themeToggler = $("#theme_switch");

  $win.on("load", (event: Event) => {
    appSize.onWindowLoaded(event, $liSize)
    appTheme.onwindowLoaded($themeToggler, $docElement)
  })

  $($themeToggler).on('change', (event: Event) => {
    appTheme.toggleTheme(event, $docElement)
  })

  $liSize.on("click", (event: Event) => {
    event && event.preventDefault()
    $liSize?.removeClass("active")
    const currentElement = $(event.target as HTMLLIElement)
    appSize.addjustPageSize(currentElement)
  })

  // submit form
  $form.on('submit', (event:Event) => {
    event.preventDefault()
    console.log("vvvvvvv: ", inputValidator.isValidEmail)
  })

  // email field
  $emailInput.on("blur", (event: Event) => {
    const $emailField = $(event.target as HTMLInputElement)
    const requiredMessage = $emailField.attr("data-validator-required")
    const InvalidMessage = $emailField.attr("data-validator-email")
    inputValidator.validateRequiredFiled($emailField, {
      validatorMsg: requiredMessage
    })
    inputValidator.validateEmail($emailField, {
      validatorMsg: InvalidMessage
    })
  })

  // password field
  $passwordInput.on("blur", (event: Event) => {
    const $passField = $(event.target as HTMLInputElement)
    const requiredMessage = $passField.attr("data-validator-required")
    inputValidator.validateRequiredFiled($passField, {
      validatorMsg: requiredMessage
    })
  })

  $passwordInput.on("keyup", (event: Event) => {
    const $passField = $(event.target as HTMLInputElement)
    const requiredMessage = $passField.attr("data-validator-required")
    inputValidator.validatePasswordField($passField, {
      validatorMsg: requiredMessage,
      $matcherField: $repeatPasswordInput
    })
  })

  // repeatPasswordInput field
  $repeatPasswordInput.on("keyup", (event: Event) => {
    const $repeatPassField = $(event.target as HTMLInputElement)
    const requiredMessage = $repeatPassField.attr("data-validator-required")
    const repeatedPassMsg = $repeatPassField.attr("data-validator-repeat-pass")
    inputValidator.validateRequiredFiled($repeatPassField, {
      validatorMsg: requiredMessage
    })
    inputValidator.validateRepeatPasswordFiled($repeatPassField, {
      validatorMsg: repeatedPassMsg,
      $matcherField: $passwordInput
    })
  })
})

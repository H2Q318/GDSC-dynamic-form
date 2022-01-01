let dataArray = {};
const root = document.querySelector('#root');
const form = document.createElement('form');
let pageNumber = 0;

fetch(
  'https://gist.githubusercontent.com/bittermeatball/7854f3d7950469b0203a068fcaf27908/raw/1de87462c4f8c2fd0bfb9d452b246c92697b2eee/sample.json'
)
  .then((response) => response.json())
  .then((data) => (dataArray = data))
  .then(() => {
    const wrapperHeader = document.createElement('div');
    const wrapperContent = document.createElement('div');
    const wrapperFooter = document.createElement('div');

    // Header
    const titleForm = document.createElement('h1');
    const descriptionForm = document.createElement('p');

    wrapperHeader.id = 'wrapperHeader';
    titleForm.innerHTML = dataArray.title;
    descriptionForm.innerHTML = dataArray.description;
    wrapperHeader.appendChild(titleForm);
    wrapperHeader.appendChild(descriptionForm);

    // Content
    const sections = dataArray.sections;

    wrapperContent.id = 'wrapperContent';
    sections.map((section) => {
      const form = document.createElement('form');
      const titleSection = document.createElement('h2');
      const descriptionSection = document.createElement('p');
      const wrapperQuestion = document.createElement('div');
      const questions = section.questions;

      wrapperQuestion.id = 'wrapperQuestion';
      questions.map((question) => {
        const questionElement = document.createElement('h3');
        questionElement.innerHTML = question.question;
        wrapperQuestion.appendChild(questionElement);

        switch (question.type) {
          case 'SHORT_TEXT':
            const inputShortText = document.createElement('input');
            inputShortText.defaultValue = question.defaultAnswer ?? '';
            inputShortText.placeholder = question.description ?? '';
            inputShortText.required = question.required;
            inputShortText.type = question.type;
            wrapperQuestion.appendChild(inputShortText);
            break;
          case 'LONG_TEXT':
            const inputLongText = document.createElement('textarea');
            inputLongText.minLength = question.attrs.minLength;
            inputLongText.maxLength = question.attrs.maxLength;
            inputLongText.defaultValue = question.defaultAnswer ?? '';
            inputLongText.placeholder = question.description ?? '';
            inputLongText.required = question.required;
            inputLongText.type = question.type;
            wrapperQuestion.appendChild(inputLongText);
            break;
          case 'NUMBER':
            const inputNumber = document.createElement('input');
            inputNumber.defaultValue = question.defaultAnswer ?? '';
            inputNumber.placeholder = question.description ?? '';
            inputNumber.required = question.required;
            inputNumber.type = question.type;
            inputNumber.min = question.attrs.min;
            inputNumber.max = question.attrs.max;
            wrapperQuestion.appendChild(inputNumber);

            break;
          case 'RADIO':
            const decripstionQuestion = document.createElement('p');
            const wrapperOptions = document.createElement('div');
            const radioOptions = question.options;

            wrapperOptions.id = 'wrapperOptions';
            decripstionQuestion.innerHTML = question.description;
            radioOptions.map((option) => {
              const wrapperOption = document.createElement('div');
              const inputRadio = document.createElement('input');
              const labelOption = document.createElement('label');

              wrapperOption.id = 'wrapperOption';
              labelOption.innerHTML = option.text;
              inputRadio.required = question.required;
              inputRadio.type = question.type;
              inputRadio.value = option.value;
              inputRadio.name = question.question;
              if (inputRadio.value == question.defaultAnswer) {
                inputRadio.defaultChecked = true;
              }
              wrapperOption.appendChild(inputRadio);
              wrapperOption.appendChild(labelOption);
              wrapperOptions.appendChild(wrapperOption);
            });
            wrapperQuestion.appendChild(decripstionQuestion);
            wrapperQuestion.appendChild(wrapperOptions);
            break;
        }
      });

      titleSection.innerHTML = section.title;
      descriptionSection.innerHTML = section.description ?? '';
      form.appendChild(titleSection);
      form.appendChild(descriptionSection);
      form.appendChild(wrapperQuestion);
      wrapperContent.appendChild(form);
    });

    // Footer
    const buttonPrevious = document.createElement('button');
    const buttonNext = document.createElement('button');

    wrapperFooter.id = 'wrapperFooter';
    buttonPrevious.innerHTML = 'Mục trước';
    buttonPrevious.classList = 'btn btnPrevious';
    buttonNext.innerHTML = 'Mục sau';
    buttonNext.classList = 'btn btnNext';
    wrapperFooter.appendChild(buttonPrevious);
    wrapperFooter.appendChild(buttonNext);

    root.appendChild(wrapperHeader);
    root.appendChild(wrapperContent);
    root.appendChild(wrapperFooter);

    // Validate
    const validate = () => {
      let checkValidate = true;
      const shortTexts = document.querySelectorAll(
        'form:not(.d-none) #wrapperQuestion input'
      );

      const longTexts = document.querySelectorAll(
        'form:not(.d-none) #wrapperQuestion textarea'
      );

      shortTexts.forEach((shortText) => {
        if (shortText.value.length === 0 && shortText.type == 'text') {
          shortText.classList.add('invalid');
          checkValidate = false;
        } else if (shortText.type == 'number' && shortText.value === '') {
          shortText.classList.add('invalid');
          checkValidate = false;
        }
      });

      longTexts.forEach((longText) => {
        if (longText.value.length === 0) {
          longText.classList.add('invalid');
          checkValidate = false;
        }
      });

      return checkValidate;
    };

    // Event
    const forms = document.querySelectorAll('form');

    const reRender = () => {
      forms.forEach((form, index) => {
        if (index == pageNumber) form.classList.remove('d-none');
        else form.classList.add('d-none');
      });

      if (pageNumber == 0) {
        buttonPrevious.classList.add('disabled');
      } else if (pageNumber == sections.length - 1) {
        buttonNext.classList.add('disabled');
      } else {
        buttonPrevious.classList.remove('disabled');
        buttonNext.classList.remove('disabled');
      }
    };

    reRender();

    buttonPrevious.addEventListener('click', () => {
      if (pageNumber > 0) pageNumber--;
      reRender();
    });

    buttonNext.addEventListener('click', () => {
      if (pageNumber < sections.length - 1 && validate()) {
        pageNumber++;
        const shortTexts = document.querySelectorAll(
          'form:not(.d-none) #wrapperQuestion input'
        );
        const longTexts = document.querySelectorAll(
          'form:not(.d-none) #wrapperQuestion textarea'
        );

        shortTexts.forEach((shortText) => {
          shortText.classList.remove('invalid');
        });

        longTexts.forEach((longText) => {
          longText.classList.remove('invalid');
        });
      }
      reRender();
    });
  });

// Quiz 2
(function quiz2() {
  const questionContainer = document.getElementById('question-container');
  const selectionContainer = document.getElementById('selection-container');

  let currentQuestion = 0;
  let userAnswers = [];

  const questions = [
      {
          text: 'Sind Sie eine Privatperson oder eine juristische Person?',
          options: [
              { text: 'Unternehmen', value: 'company', image: 'office-building.png' },
              { text: 'Privatperson', value: 'individual', image: 'person.png' }
          ],
          nextQuestion: 1
      },
      {
          text: 'Zu welchem System wollen Sie informiert werden?',
          options: [
              { text: 'Solaranlagen', value: 'solar', image: "solar-energy.png" },
              { text: 'Wärmepumpen', value: 'heat-pump', image: "water-heater.png" },
              { text: 'Beide', value: 'both', image: "list.png" }
          ]
      },
      {
          text: 'Für welchen Typ Solaranlagen interessieren Sie sich?',
          options: [
              { text: 'Solarthermie', value: 'thermal', image: "solar-energy.png" },
              { text: 'Photovoltaik', value: 'photovoltaic', image: "water-heater.png" },
          ]
      }
  ];

  function showLoader() {
      const loader = document.querySelector('.loader');
      loader.style.display = 'block';
  }

  function hideLoader() {
      const loader = document.querySelector('.loader');
      loader.style.display = 'none';
  }

  function showForm() {
      questionContainer.innerHTML = '';

      const form = document.createElement('form');
      form.innerHTML = `
          <br>
          <h2>Pflegen Sie Ihre Kontaktinformationen ein, um einen kostenlosen Forderberatung zu erhalten!</h2>
          <div class="container">
              <form method='POST'>
                  <div class="form-row">
                      <div class="form-group col-md-6">
                          <label for="firstName">Vorname</label>
                          <input type="text" class="form-control" id="firstName" placeholder="Vorname" required>
                      </div>
                      <div class="form-group col-md-6">
                          <label for="lastName">Nachname</label>
                          <input type="text" class="form-control" id="lastName" placeholder="Nachname" required>
                      </div>
                  </div>
                  <div class="form-row">
                      <div class="form-group col-md-12">
                          <label for="street">Straße und Hausnummer</label>
                          <input type="text" class="form-control" id="street" placeholder="Straße und Hausnummer" required>
                      </div>
                  </div>
                  <div class="form-row">
                      <div class="form-group col-md-6">
                          <label for="postalCode">PLZ</label>
                          <input type="number" class="form-control" id="postalCode" placeholder="PLZ" required>
                      </div>
                      <div class="form-group col-md-6">
                          <label for="city">Stadt</label>
                          <input type="text" class="form-control" id="city" placeholder="Stadt" required>
                      </div>
                  </div>
                  <div class="form-row">
                      <div class="form-group col-md-6">
                          <label for="email">Email</label>
                          <input type="email" class="form-control" id="email" placeholder="Email" required>
                      </div>
                      <div class="form-group col-md-6">
                          <label for="phone">Telefon</label>
                          <input type="tel" class="form-control" id="phone" placeholder="Telefon">
                      </div>
                  </div>
                  <button type="submit" class="btn btn-primary">Submit</button>
              </form>
          </div>
      `;

      form.addEventListener('submit', async function (event) {
          event.preventDefault();
          showLoader();
          const firstName = document.getElementById('firstName').value;
          const lastName = document.getElementById('lastName').value;
          const street = document.getElementById('street').value;
          const postalCode = document.getElementById('postalCode').value;
          const city = document.getElementById('city').value;
          const email = document.getElementById('email').value;
          const phone = document.getElementById('phone').value;

          const formData = {
              firstName: firstName,
              lastName: lastName,
              street: street,
              postalCode: postalCode,
              city: city,
                email: email,
                phone: phone,
                useranswers: userAnswers
            }
            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                if (!response.ok) {
                    throw new Error("Some Error")
                } else {
                    hideLoader();
                    alert('Danke! Wir haben Ihre Anfrage erfolgreich bekommen')
                    window.location.href = '/';
                }
            } catch (error) {
                console.log("Error sending the data!")
            } finally {
                hideLoader();
            }
        });

        questionContainer.appendChild(form);
    }

    function showQuestion() {
        const question = questions[currentQuestion];
        questionContainer.innerHTML = `<h2>${question.text}</h2>`;
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            const icon = document.createElement('img');
            icon.src = `static/${option.image}`;
            icon.alt = 'Icon';
            button.appendChild(icon);
            const span = document.createElement('div');
            span.textContent = option.text;
            button.appendChild(span);
            button.value = option.value;
            button.onclick = () => {
                handleAnswer(option.value);
            };
            questionContainer.appendChild(button);
        });
    }

    function handleAnswer(answer) {
        if (questions[currentQuestion].nextQuestion === -1) {
            alert(`You selected: ${answer}`);
        } else {
            userAnswers.push({ question: questions[currentQuestion].text, answer: answer });
            if (answer === 'solar') {
                currentQuestion = 2;
            } else if (answer === 'heat-pump' || answer == 'both' || answer === 'thermal' || answer === 'photovoltaic') {
                showForm();
                console.log(userAnswers)
                return;
            } else {
                currentQuestion = questions[currentQuestion].nextQuestion;
            }
            showQuestion();
        }
    }

    showQuestion();
})();

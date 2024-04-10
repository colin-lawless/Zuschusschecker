// Quiz 1
(function quiz1() {
    const questionContainer = document.getElementById('question-container');
    const selectionContainer = document.getElementById('selection-container');
  
    let currentQuestion = 0;
    let userAnswers = [];
  
    const questions = [
        {
            text: 'In welchem Bundesland befindet sich das Objekt?',
            options: [
                { text: 'Berlin', value: 'berlin' },
                { text: 'Brandenburg', value: 'brandenburg' },
                { text: 'Sachsen', value: 'sachsen' },
                { text: 'Mecklenburg-Vorpommern', value: 'mecklenburg-vorpommern' }
            ],
            nextQuestion: 1
        },
        {
            text: 'Um welche Art von Objekt handelt es sich?',
            options: [
                { text: 'Einfamilienhaus', value: 'single-family-house', image: 'single-house.png' },
                { text: 'Mehrfamilienhaus', value: 'multi-family-house', image: 'multi-house.png' }
            ],
            nextQuestion: 2
        },
        {
            text: 'Welche dieser Dachformen kommt der Ihren am nähsten?',
            options: [
                { text: 'Satteldach', value: 'gabled-roof', image: 'gable.png' },
                { text: 'Flachdach', value: 'flat-roof', image: 'flat.png' },
                { text: 'Pultdach', value: 'shed-roof', image: 'shed.png' },
                { text: 'Andere', value: 'other-roof', image: 'other.png' }
            ],
            nextQuestion: 3
        },
        {
            text: 'Wie viele Menschen leben in Ihrem Haushalt?',
            options: [
                { text: '1-2', value: '1-2' },
                { text: '3-4', value: '3-4' },
                { text: '5+', value: '5+' }
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
        selectionContainer.innerHTML = '';
  
        const form = document.createElement('form');
        form.innerHTML = `
            <br>
            <div class="container">
                <form method='POST'>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="firstName">Vorname</label>
                            <input type="text" class="form-control" id="vfirstName" placeholder="Vorname" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="lastName">Nachname</label>
                            <input type="text" class="form-control" id="vlastName" placeholder="Nachname" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <label for="street">Monatlicher Stromverbrauch</label>
                            <input type="number" class="form-control" id="velec" placeholder="Verbrauch in kWh">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <label for="street">Straße und Hausnummer</label>
                            <input type="text" class="form-control" id="vstreet" placeholder="Straße und Hausnummer" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="postalCode">PLZ</label>
                            <input type="number" class="form-control" id="vpostalCode" placeholder="PLZ" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="city">Stadt</label>
                            <input type="text" class="form-control" id="vcity" placeholder="Stadt" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="vemail" placeholder="Email" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="phone">Telefon</label>
                            <input type="tel" class="form-control" id="vphone" placeholder="Telefon">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        `;
  
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            showLoader();
            const firstName = document.getElementById('vfirstName').value;
            const lastName = document.getElementById('vlastName').value;
            const elec = document.getElementById('velec').value;
            const street = document.getElementById('vstreet').value;
            const postalCode = document.getElementById('vpostalCode').value;
            const city = document.getElementById('vcity').value;
            const email = document.getElementById('vemail').value;
            const phone = document.getElementById('vphone').value;
  
            const formData = {
                firstName: firstName,
                lastName: lastName,
                elec: elec,
                street: street,
                postalCode: postalCode,
                city: city,
                email: email,
                phone: phone,
                useranswers: userAnswers
            }
            try {
                const response = await fetch('/vsubmit', {
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
                    resetQuiz();
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
        // Check if we've reached the end of the quiz and need to show the form
        if (currentQuestion >= questions.length) {
            showForm();
            return; // Exit the function to prevent showing any more questions
        }
    
        // Clear any previous options in the selection container
        selectionContainer.innerHTML = '';
    
        // Proceed with showing the current question
        const question = questions[currentQuestion];
        questionContainer.innerHTML = `<h2>${question.text}</h2>`;
    
        // Loop through options and create buttons
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            if (option.image) { // Add an image if it exists
                const icon = document.createElement('img');
                icon.src = `static/${option.image}`;
                icon.alt = 'Icon';
                button.appendChild(icon);
            }
            // Add text to the button
            const span = document.createElement('div');
            span.textContent = option.text;
            button.appendChild(span);
            button.value = option.value;
    
            // Set the button click event to handle the answer
            button.onclick = () => {
                handleAnswer(option.value);
            };
    
            // Append button to the selectionContainer
            selectionContainer.appendChild(button);
        });
    }
    
  
    function handleAnswer(answer) {
        userAnswers.push({ question: questions[currentQuestion].text, answer: answer });
  
        if (currentQuestion === questions.length - 1) {
            showForm();
        } else {
            currentQuestion = questions[currentQuestion].nextQuestion;
            showQuestion();
        }
    }

    function resetQuiz() {
        currentQuestion = 0;
        userAnswers = [];
        showQuestion();
    }
    showQuestion();
  })();
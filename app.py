from flask import Flask, render_template, request, jsonify
import json
from flask_mail import Mail, Message

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_USERNAME'] = '' 
app.config['MAIL_PASSWORD'] = '' 
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_DEFAULT_SENDER'] = ''

mail = Mail(app)

@app.route('/')
def hello_world():
    return render_template('home.html')

@app.route('/formular')
def formular():
    return render_template('form.html')

@app.route('/preise')
def price():
    return render_template('price.html')

@app.route('/leistungen')
def feauture():
    return render_template('features.html')

@app.route('/submit', methods=['POST'])
def submit_form():
    data = request.data
    final_data = json.loads(data.decode('utf-8'))
    firstName = final_data['firstName']
    lastName = final_data['lastName']
    street = final_data['street']
    postalcode = final_data['postalCode']
    city = final_data['city']
    email = final_data['email']
    phone = final_data['phone']
    userquestionanswer = final_data['useranswers']

    self_subject = 'New Submission: User Details'
    self_body = f"Dear Team,\n\nA new submission has been received from a user. Here are the details:\n\nName: {firstName} {lastName}\nEmail: {email}\nPostal Code: {postalcode}\nCity: {city}\nTelefon: {phone}\nAddress: {street}\n\nUser's Answers:\n"
    
    for question_answer in userquestionanswer:
        self_body += f"\nQuestion: {question_answer['question']}\nAnswer: {question_answer['answer']}\n"

    self_body += "\nPlease review the information and take necessary action.\n\nBest regards,\nZuschusschecker"

    msg = Message(self_subject, recipients=["colin@thinkvoltaic.de"], body=self_body)
    mail.send(msg)

    user_subject = 'Anfrage Bestätigung Zuschusschecker'
    user_body = f"Sehr geehrte/r {firstName} {lastName},\n\nVielen Dank für Ihre Anfrage. Wir haben all Ihrer Informationen erhalten. Wir melden uns zeitnah mit einer Förderberatung.\n\nMit freundlichen Grüßen,\nZuschusschecker"
    msg = Message(user_subject,recipients=[email],body= user_body)
    mail.send(msg)
    
    return jsonify({'message': 'Form submitted successfully'})

@app.route('/voltaicfunnel')
def voltaic_html():
    return render_template('voltaicfunnel.html')

@app.route('/vsubmit', methods=['POST'])
def voltaic_funnel():
    vdata = request.data
    vfinal_data = json.loads(vdata.decode('utf-8'))
    vfirstName = vfinal_data['firstName']
    vlastName = vfinal_data['lastName']
    velec = vfinal_data['elec']
    vstreet = vfinal_data['street']
    vpostalcode = vfinal_data['postalCode']
    vcity = vfinal_data['city']
    vemail = vfinal_data['email']
    vphone = vfinal_data['phone']
    vuserquestionanswer = vfinal_data['useranswers']

    vself_subject = 'Neue Anfrage von der Voltaic-Website'
    vself_body = f"Liebes Team,\n\nHier ein neuer Lead:\n\nName: {vfirstName} {vlastName}\nEmail: {vemail}\nPLZ: {vpostalcode}\nStadt: {vcity}\nTelefon: {vphone}\nStraße und Hausnummer: {vstreet}\n\nInfos zum Objekt:\n\nFrage: Wie hoch ist Ihr Stromverbrauch? \nAntwort: {velec}kWh im Monat\n"
    
    for vquestion_answer in vuserquestionanswer:
        vself_body += f"\nFrage: {vquestion_answer['question']}\nAntwort: {vquestion_answer['answer']}\n"

    vmsg = Message(vself_subject, recipients=["colin@thinkvoltaic.de"], body=vself_body)
    mail.send(vmsg)

    vuser_subject = 'Anfrage Bestätigung Voltaic'  
    vuser_body = f"Sehr geehrte/r {vfirstName} {vlastName},\n\nVielen Dank für Ihre Anfrage. Wir haben all Ihrer Informationen erhalten. Wir melden uns zeitnah.\n\nMit freundlichen Grüßen,\nIhr Voltaic Team"
    vmsg = Message(vuser_subject, recipients=[vemail], body=vuser_body)
    mail.send(vmsg)
    
    return jsonify({'message': 'Form submitted successfully'})

if __name__ == '__main__':
    app.run(debug=True)

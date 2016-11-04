import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';

class QuestionDetail extends Component {
  constructor(props) {
    super(props)

    //saves array of the answers inherited through props, in order to be able to add more choices/inputs to it
    this.state = {
      inputs: this.props.question
    }
  }

  handleChange(changed, index, event) {
    var newInputs = this.props.question;
    if(index !== undefined){
      newInputs[changed][index] = event.target.value;
    } else {
      newInputs[changed] = event.target.value;
    }

    this.setState({
      inputs: newInputs
    });
  }

  handleSubmit() {
    let id = this.props.question._id;
    let text = this.props.question.text;
    let choices = this.props.question.choices;
    fetch('http://localhost:3011/api/content/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "text": text,
        "choices": choices
      })
    }).then(response => response.json());
    // console.log(this.props.question)
    // console.log('choices', this.props.question.choices);
    // console.log('text', this.props.question.text)
  }

  renderQuestion() {
    const { QuestionDetailStyle, editableTextStyle } = styles;
    return (
      <div>
        <h2>Question</h2>
        <textArea style = { editableTextStyle } value={this.props.question.text} onChange={this.handleChange.bind(this, 'text', undefined)}/>
      </div>
    )
  }


  renderAnswers() {
    const { answerInputStyle, fontAwesomeStyle } = styles;
    if (this.props.question.type === 'question') {
      console.log(this.props.question.choices)
      return (
        <div>
          <h2>Answers</h2>
            {this.props.question.choices.map((choiceInput, index) => {
              return (
                <div>
                  <input style={answerInputStyle} placeholder="..." value={choiceInput} onChange={this.handleChange.bind(this, 'choices', index)}/>
                </div>
              )
            })}
          <i className="fa fa-plus-circle" aria-hidden="true" style={fontAwesomeStyle}></i>
          <p onClick={this.addChoice.bind(this)} style={{display: "inline"}}> Add another choice</p>
        </div>
      )
    }
  }

  //adds another text input for answer choices, up to 5 total
  addChoice() {
    //console.log('work')
    let choices = this.state.inputs.choices;
    choices.push("");
    this.setState({inputs: choices});
  }

  render() {
    const { QuestionDetailStyle, saveButtonStyle, deleteButtonStyle } = styles;
    return (
      <Col sm={5} smOffset={7} style={QuestionDetailStyle}>
        <i style={{color: lightGrey}}>Click elements to edit</i>
        {this.renderQuestion()}
        {this.renderAnswers()}
        <Button style={saveButtonStyle} onClick={this.handleSubmit.bind(this)}>Save</Button>
        <Button style={deleteButtonStyle}>Delete</Button>
      </Col>
    )
  }
}
const coral = '#FA848A'
const lightGrey = '#A3A8AB'

const styles = {
  QuestionDetailStyle: {
    height: '100%',
    fontSize: 20,
    position: 'relative',
    paddingTop: 90,
    width: '100%',
    height: 40,
    textWrap: true,
    paddingRight: 0,
    paddingLeft:40,
    fontFamily: 'Lato',
    zIndex: -1,
  },

  fontAwesomeStyle: {
    color: lightGrey,
    display: 'inline',
    paddingRight: 3,
  },

  answerInputStyle: {
    border: 'none',
    display: 'inline',
    color: '#7A7886'
  },

  editableTextStyle: {
    padding: 10,
    color: '#7A7886',
    opacity: 1,
    border: 0.2,
    textAlign: 'justified',
    display: 'inline-block',
    position: 'relative',
    width: '40%',
    height: '100px'
  },
  saveButtonStyle: {
    color: 'white',
    backgroundColor: coral,
    marginRight: '20px',
    marginTop: 50,
    marginLeft: 150
  },
    deleteButtonStyle: {
    color: 'white',
    backgroundColor: coral,
    marginTop: 50,
  }
}

export default QuestionDetail;

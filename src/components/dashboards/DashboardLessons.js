import React, { Component } from 'react';
import Navbar from '../navbar/Navbar';
import LessonTitleList from '../lessons/LessonTitleList';
import QuestionTitleList from '../questions/QuestionTitleList';
import QuestionDetail from '../questions/QuestionDetail';
import NewQuestion from '../questions/NewQuestion';
import { Button, Col, Row } from 'react-bootstrap';


class App extends Component {
  constructor() {
    super();

    this.state = {
      selectedLesson: null,
      selectedLessonQuestions: null,
      selectedLessonId: null,
      selectedQuestion: null,
      editLesson: false,
      //determines whether 'NewQuestion' is visible.
      creatingQuestion: false,
    }
  }

  deletedLesson() {
    this.setState({
      selectedLesson: null,
      selectedLessonQuestions: null,
      selectedLessonId: null,
      selectedQuestion: null
    })
  }

  deletedQuestion(id) {
    var newQ = this.state.selectedLessonQuestions.filter(question => question._id !== id)
    this.setState({
      selectedQuestion: null,
      selectedLessonQuestions: newQ
    })
  }

  handleLessonClick (lesson) {
    let url = 'http://localhost:3011/api/lessons/' + lesson.lessonId;
    fetch(url, { method: 'get' })
      .then(data => {
        return data.json();
      })
      .then(data => {
        console.log(lesson);
        this.setState({
          selectedLesson: lesson,
          selectedLessonQuestions: data.lessonContent,
          selectedLessonId: lesson.lessonId,
          selectedQuestion: null,
          creatingQuestion: false
        });
      });
  }


  handleQuestionClick (question) {
    this.setState({
      selectedQuestion: question,
      creatingQuestion: null
    });
  }

//enables appearance of question-creation form (NewQuestion.js)
  handleAddQuestionClick () {
    this.setState({
      creatingQuestion: true,
      selectedQuestion: null
    });
  }

//at the moment this just clears the NewQuestion form without saving.
  handleSaveNewQuestionClick (text, choices, type, answer) {
    var length = this.state.selectedLessonQuestions.length + 1;
    var id = this.state.selectedLessonId;
    console.log('text', text)
    console.log('choices', choices)
    console.log('type', type)
    console.log(length)
    fetch('http://localhost:3011/api/content/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "text": text,
        "choices": choices,
        "type": type,
        "order": length,
        "answer": answer
      })
    })
    .then(response => response.json())
    .then(response => {
      this.state.selectedLessonQuestions.push(response)
      this.setState({
        creatingQuestion: null
      });
    })
  }

  handleSubmit(id, text, choices, type, answer) {
    fetch('http://localhost:3011/api/content/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "text": text,
        "choices": choices,
        "type": type,
        "answer": answer
      })
    })
    .then(response => response.json())
    .then(response => {
      var selected = this.state.selectedQuestion;
      selected.text = text;
      selected.choices = choices;
      selected.type = type;
      selected.answer = answer;
      this.setState()
    })
  }

  renderNewQuestion() {
    if (this.state.creatingQuestion) {
      return <NewQuestion
        handleSaveNewQuestionClick={this.handleSaveNewQuestionClick.bind(this)}
        />
    }
  }


  renderQuestionList () {
    if (this.state.selectedLesson) {
      return (
        <QuestionTitleList
          lessonId={this.state.selectedLessonId}
          lessonContent={this.state.selectedLessonQuestions}
          selectedQuestion={this.state.selectedQuestion}
          handleQuestionClick={this.handleQuestionClick.bind(this)}
          handleAddQuestionClick={this.handleAddQuestionClick.bind(this)}
        />
      )
    }
  }

//this is the component that displays the text and choices of currently selected question - can add choices but currently does not save. Also will need to be tweaked to display which choice is the correct answer.
  renderQuestionDetail () {
    if (this.state.selectedQuestion) {
      return (
        <QuestionDetail
          handleSubmit = {this.handleSubmit.bind(this)}
          question={JSON.parse(JSON.stringify(this.state.selectedQuestion))}
          deletedQuestion={this.deletedQuestion.bind(this)}
        />
      )
    }
  }

  render() {
    return (
      <Row className="App">
        <Navbar />
        <div className="container-fluid">
        <LessonTitleList selectedLessonId={this.state.selectedLessonId} handleLessonClick={this.handleLessonClick.bind(this)} hideContent={this.deletedLesson.bind(this)} />
        {this.renderQuestionList()}
        {this.renderQuestionDetail()}
        {this.renderNewQuestion()}
        </div>
      </Row>
    );
  }
}

export default App;

import React, { Component } from "react";
import { Grid, Icon } from "semantic-ui-react";
import City from "../components/City.js";
import Map from "../components/Map.js";
import Score from "../components/Score.js";
import DeadModal from "../components/DeadModal";
import ScoreModal from "../components/ScoreModal";
import { Spring } from "react-spring/renderprops";
import { API_ROOT } from "../constants/constants.js";
import GOOGLEMAPS from "../Secrets.js";

class QuizContainer extends Component {
  state = {
    cities: [],
    cityIndex: 0,
    isMarkerShown: false,
    yourChoice: null,
    score: 3000,
    previousScore: 3000,
    nextButton: false,
    questions: [],
    unresponsive: false,
    deadModal: false,
    scoreModal: false,
  };

  createGame = () => {
    let dataObj = {
      game: {
        user_id: this.props.user.id,
        score: this.state.score,
        questions_attributes: [...this.state.questions],
      },
    };
    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
    };

    fetch(`${API_ROOT}/games`, configObj).then((resp) => resp.json());
  };

  showScoreModal = () => {
    this.setState({
      scoreModal: true,
    });
  };

  closeScoreModal = () => {
    this.setState({
      scoreModal: false,
    });
  };

  showDeadModal = () => {
    this.setState({
      deadModal: true,
    });
  };

  closeDeadModal = () => {
    this.setState({
      deadModal: false,
    });
  };

  resetPlay = () => {
    fetch(`${API_ROOT}/randomtwenty`)
      .then((resp) => resp.json())
      .then((cities) => this.setState({ cities: cities }));

    this.setState({
      cityIndex: 0,
      isMarkerShown: false,
      yourChoice: null,
      score: 3000,
      previousScore: 3000,
      distance: null,
      nextButton: false,
      questions: [],
      deadModal: false,
      unresponsive: false,
      scoreModal: false,
    });
  };

  setDistance = (distance) => {
    this.setState({ distance: distance });
  };

  addQuestion = (question) => {
    this.setState({
      questions: [...this.state.questions, question],
    });
  };

  componentDidMount() {
    fetch(`${API_ROOT}/randomtwenty`)
      .then((resp) => resp.json())
      .then((cities) => this.setState({ cities: cities }));
  }

  toggleMarker = () => {
    this.setState({ isMarkerShown: !this.state.isMarkerShown });
  };

  setChoice = (latlng) => {
    this.setState({ yourChoice: latlng });
  };

  nextQuest = () => {
    this.setState({
      cityIndex: this.state.cityIndex + 1,
      nextButton: !this.state.nextButton,
      unresponsive: false,
      isMarkerShown: false,
      yourChoice: null,
      distance: null,
    });
  };

  toggleNextButton = () => {
    this.setState({
      nextButton: !this.state.nextButton,
    });
  };

  setScore = (distance) => {
    this.setState((state) => ({
      score: state.score - distance,
      previousScore: state.score,
    }));
  };

  makeUnresp = () => {
    this.setState({ unresponsive: true });
  };

  render() {
    return (
      <div>
        <DeadModal
          show={this.state.deadModal}
          close={this.closeDeadModal}
          resetPlay={this.resetPlay}
        />
        <ScoreModal
          show={this.state.scoreModal}
          close={this.closeScoreModal}
          resetPlay={this.resetPlay}
          score={this.state.score}
        />
        <City
          currentCity={this.state.cities[this.state.cityIndex]}
          cityIndex={this.state.cityIndex}
          nextButton={this.state.nextButton}
          nextQuest={this.nextQuest}
        />
        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: this.state.distance ? 1 : 0 }}
        >
          {(props) => (
            <div id="distance-away" style={props}>
              <h4>
                <Icon name="check circle outline" size={"small"} />
                {this.state.distance}
              </h4>
            </div>
          )}
        </Spring>
        <Grid id="game-grid">
          <Grid.Row>
            <Grid.Column width={13}>
              <Map
                setDistance={this.setDistance}
                makeUnresp={this.makeUnresp}
                unresponsive={this.state.unresponsive}
                showScoreModal={this.showScoreModal}
                cityIndex={this.state.cityIndex}
                createGame={this.createGame}
                showDeadModal={this.showDeadModal}
                currentScore={this.state.score}
                addQuestion={this.addQuestion}
                toggleNextButton={this.toggleNextButton}
                setScore={this.setScore}
                currentCity={this.state.cities[this.state.cityIndex]}
                yourChoice={this.state.yourChoice}
                setChoice={this.setChoice}
                toggleMarker={this.toggleMarker}
                isMarkerShown={this.state.isMarkerShown}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLEMAPS}&libraries=geometry`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `750px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </Grid.Column>
            <Grid.Column width={1}>
              <Score
                score={this.state.score}
                previousScore={this.state.previousScore}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default QuizContainer;

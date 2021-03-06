import React, { Component } from "react";
import "./BookLogMain.css";
import AddBookDialog from "./AddBookDialog";
import Dailylog from "./DailyLog";
// import FavoriteIcon from "./FavoriteIcon";
import CompletedIcon from "./CompletedIcon";
import DeleteIcon from "./DeleteIcon";
import { addBookLogManual } from "../actions/addBookLogManual";
import { compose } from "redux";
import { Link, Redirect } from "react-router-dom";
import { Grid, Row } from "react-flexbox-grid";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { AddCircle, Search } from "@material-ui/icons";
import { Menu, MenuItem, IconButton } from "@material-ui/core";

class BookLogMain extends Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  renderList(books) {
    if (!books) return;
    return books.map((book, idx) => {
      const { title, authors, pageCount, imageLinks, startDate } = book.item;
      const { completed } = book;
      // const { favorite } = book
      let mainDivTitle =
        title.length < 46 ? title : title.slice(0, 46) + " ...";
      return (
        <div className="mainDiv" key={idx} id={book.id}>
          <div className="headerDiv">
            <div className="leftIcon">
              <DeleteIcon id={book.id} title={title} authors={authors} logType="BookLog"/>
            </div>
            <img src={imageLinks.smallThumbnail} alt={title} />
            <div className="iconDiv">
              <Dailylog title={title} authors={authors} id={book.id} />
              <CompletedIcon id={book.id} completed={completed} />
              {/* <FavoriteIcon id={book.id} favorite={favorite} /> */}
            </div>
          </div>

          <div className="bodyDiv compStatus">
            <div className="title">{mainDivTitle}</div>
            <div>{authors}</div>
            <div>
              {/* Read "" pages of{" "} */}
              Total Pages: {pageCount ? `${pageCount} Pages` : " unknown "}
            </div>
            <div>
              Started Reading on{" "}
              {startDate
                .toDate()
                .toJSON()
                .slice(0, 10)}
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    const { anchorEl } = this.state;
    const { auth } = this.props;

    // check login status
    if (!auth.uid) return <Redirect to="signin" />;

    return (
      <Grid className="main">
        <Row className="row">
          {this.renderList(this.props.bookLog)}
          <div className="sample">
            <IconButton
              aria-owns={anchorEl ? "simple-menu" : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <AddCircle />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <AddBookDialog />
              <Link to="/search" className="link">
                <MenuItem onClick={this.handleClose} className="popText">
                  <Search className="popIcon" />
                  Search New Book
                </MenuItem>
              </Link>
            </Menu>
          </div>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    bookLog: state.firestore.ordered.bookLog,
    auth: state.firebase.auth
  };
}

export default compose(
  connect(
    mapStateToProps,
    { addBookLogManual }
  ),
  firestoreConnect(props => {
    if (!props.auth.uid) return [];
    return [
      {
        collection: "bookLog",
        where: [[`userId`, "==", props.auth.uid]]
      }
    ];
  })
)(BookLogMain);

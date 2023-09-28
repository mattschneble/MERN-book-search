import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({ variables: { bookId } });
      removeBookId(bookId);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
    <Jumbotron fluid className="text-light bg-dark">
      <Container>
        <h1>Viewing saved books!</h1>
      </Container>
    </Jumbotron>
    <Container>
      <h2>
        {userData.savedBooks.length
        ? `Viewing ${userData.savedBooks.length} saved ${
          userData.savedBooks.length === 1? "book" : "books"
        }:`
      : 'You have zero saved books!'}
      </h2>
      <CardColumns>
        {userData.savedBooks.map((book) => {
          return (
            <Card key={book.bookId} border="dark">
              {book.image ? (
                <Card.Img src={book.image}
              alt={`The cover for ${book.title}`}
              variant="top"
              />
          ) : null }
          <Card.Body>
            <Card.Title>{book.title}</Card.Title>
            <p className="small">Authors: {book.authors}</p>
            <Card.Text>{book.description}</Card.Text>
            <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
              Click here to delete this book!
            </Button>
          </Card.Body>
        </Card>
        );
      })}
      </CardColumns>
    </Container>
    </>
  );
};

export default SavedBooks;
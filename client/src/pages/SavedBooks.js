import React from 'react';
import {
  Container,
  Col,
  Row,
  Card,
  Button
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || [];

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
    <div fluid className="text-light bg-dark">
      <Container>
        <h1>Viewing saved books!</h1>
      </Container>
    </div>
    <Container>
      <h2>
        {userData.savedBooks.length
        ? `Viewing ${userData.savedBooks.length} saved ${
          userData.savedBooks.length === 1? "book" : "books"
        }:`
      : 'You have zero saved books!'}
      </h2>
      <Row>
        {userData.savedBooks.map((book) => {
          return (
            <Col md="4">
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
        </Col>
        );
      })}
      </Row>
    </Container>
    </>
  );
};

export default SavedBooks;
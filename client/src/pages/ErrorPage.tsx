import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import Container from '../components/ui/Container';
import '../styles/page/errorPage.scss'

export default function ErrorPage() {
    const error = useRouteError();

    let errorMessage = "Unkown error";

    if (isRouteErrorResponse(error)) {
        errorMessage = `${error.status} ${error.statusText || error.message}`;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    return (
        <Container padding='60px'>
            <div className='error-page'>
                <h1>Oops!</h1>
                <div className="error-body">
                    <p>Sorry, an unexpected error has occurred.</p>
                    <p>
                        <i>{errorMessage}</i>
                    </p>
                    <a href="/" className='link'>Go back home</a>
                </div>
            </div>
        </Container>
    )
}

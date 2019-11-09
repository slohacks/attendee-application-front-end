import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { PageContainer, SectionHeaderContainer } from '../styled/containers';
import { SectionHeader, SectionText } from '../styled/headers';
import { forgotPassword } from '../actions/index';
import TextInput from '../components/InputTypes/2019/TextInput';
import { StyledButton } from '../components/common';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  onSubmit(values) {
    const { forgotPassword: forgotPass } = this.props;
    forgotPass(values, () => {
      this.setState({ open: true });
    });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const {
      handleSubmit, errorMessage, valid, history: { push },
    } = this.props;
    const { open } = this.state;
    return (
      <PageContainer>
        <SectionHeaderContainer>
          <SectionHeader>
            Forgot Password
          </SectionHeader>
          <SectionText>Please enter your email below to reset your password.</SectionText>
        </SectionHeaderContainer>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field
            label="Email"
            name="email"
            type="text"
            placeholder="Email"
            component={TextInput}
          />

          <StyledButton
            filled
            type="submit"
            disabled={!valid}
          >
            Submit
          </StyledButton>

          <StyledButton type="button" onClick={() => push('/login')}>
            Back
          </StyledButton>
        </form>
        <Dialog onClose={this.handleClose} open={open}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                If the account exists, you will receive an email to reset your password.
            </DialogContentText>
          </DialogContent>
        </Dialog>

        {errorMessage ? (
          <FormHelperText error>
            {errorMessage}
          </FormHelperText>
        ) : null}
      </PageContainer>
    );
  }
}

function validate(values) {
  const errors = {};
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  // Validate the inputs from 'values'
  if (!values.email) {
    errors.email = 'Email required';
  } else if (!re.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
}

function mapStateToProps(state) {
  return { auth: state.auth.authenticated, errorMessage: state.lostPass.errorMessage };
}

ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

ForgotPassword.defaultProps = {
  errorMessage: null,
};

export default reduxForm({
  validate,
  form: 'ForgotPasswordForm',
})(
  connect(mapStateToProps, { forgotPassword })(ForgotPassword),
);

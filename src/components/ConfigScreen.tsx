import React, { Component } from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Form,
  Workbench,
  Paragraph,
  TextField,
  Button,
} from '@contentful/forma-36-react-components';
import { css } from 'emotion';

export interface AppInstallationParameters {
  imgixAPIKey?: string;
}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  parameters: AppInstallationParameters;
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = { parameters: {} };

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const parameters: AppInstallationParameters | null = await this.props.sdk.app.getParameters();

    this.setState(parameters ? { parameters } : this.state, () => {
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      this.props.sdk.app.setReady();
    });
  }

  onConfigure = async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await this.props.sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters: this.state.parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  };

  setAPIKey = () => {
    // Gets the value from the API Key textfield,
    // saving it as an application installation parameter
    let keyValue: string = (document.getElementById(
      'APIKey',
    ) as HTMLInputElement).value;

    if (keyValue) {
      const keyParameter: AppInstallationParameters = { imgixAPIKey: keyValue };
      const updatedState = {
        parameters: {
          ...keyParameter,
        },
      };
      this.setState(updatedState);
    }
  };

  getAPIKey = async () => {
    return this.props.sdk.app
      .getParameters()
      .then((response: AppInstallationParameters | null) => {
        return response?.imgixAPIKey;
      });
  };

  render() {
    return (
      <Workbench className={css({ margin: '80px' })}>
        <Form>
          <Heading>App Config</Heading>
          <Paragraph>
            Welcome to your imgix Contentful app. This is your config page.
          </Paragraph>
          <TextField
            name="API Key"
            id="APIKey"
            labelText="API Key"
            value={this.state.parameters?.imgixAPIKey || ''}
            helpText="Access your API key at https://dashboard.imgix.com/api-keys"
            required={true}
          />
          <Button type="submit" buttonType="positive" onClick={this.setAPIKey}>
            Save
          </Button>
        </Form>
      </Workbench>
    );
  }
}

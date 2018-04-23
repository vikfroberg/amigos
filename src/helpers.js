import React from "react";

export const ConsumerToHoc = (
  ComposedConsumer,
  prop,
  ComposedComponent,
) => props => (
  <ComposedConsumer>
    {value => <ComposedComponent {...props} {...{ [prop]: value }} />}
  </ComposedConsumer>
);

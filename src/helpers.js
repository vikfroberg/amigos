import React from "react";

export const ConsumerToHoc = (ComposedConsumer, prop, ComposedComponent) => (
  <ComposedConsumer>
    {value => <ComposedComponent {...{ [prop]: value }} />}
  </ComposedConsumer>
);

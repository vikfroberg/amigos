export const ConsumerToHoc = (ComposedConsumer, prop, ComposedComponent) => (
  <ComposedConsumer>
    {value => <ComposedComponent {...{ [prop]: value }} />}
  </ComposedConsumer>
);

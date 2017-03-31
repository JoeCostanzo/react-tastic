import expect from 'expect.js';
import React from 'react';
import { renderShallow } from '../../test_helper';
import App from '../../../src/components/App';
import Welcome from '../../../src/components/Welcome';


describe('components/App', () => {
  let subject;

  beforeEach(() => subject = renderShallow(<App/>));

  it('renders as a div', () =>
    expect(subject.type).to.be('div'));

  it('renders as a welcome component as a child', () =>
    expect(subject.props.children).to.eql(<Welcome />));

  it('works', () => expect(1).to.eql(1));
});
/**
 * Created by joec on 3/31/2017.
 */

import expect from 'expect.js';
import React from 'react';
import { renderShallow } from '../../test_helper';
import App from '../../../src/components/App';


describe('components/App', () => {
  let subject;

  beforeEach(() => subject = renderShallow(<App/>));

  it('works', () => expect(1).to.eql(1));

  it('renders as a div', () =>
    expect(subject.type).to.be('div'));

  it('has h1 & p`s as children', () => {
    expect(subject.props.children[0].type).to.eql('h1');
    expect(subject.props.children[1].type).to.eql('p');
    expect(subject.props.children[2].type).to.eql('p');
  });
});
/**
 * Created by joec on 3/31/2017.
 */

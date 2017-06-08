import React from 'react';
import ReactDOM from 'react-dom';
import Foundation from 'foundation';
import * as Plugins from 'foundation/plugins';
import { Tabs } from 'foundation-react';

Foundation.init(Plugins);
document.querySelector('#js-tabs').addEventListener('ready.zf.tabs', () => {
  console.log(Foundation.get('#js-tabs'));
});

const App = (
  <div>
    <Tabs.Container id="react-tabs" matchHeight>
      <Tabs.Title href="#react-one">One</Tabs.Title>
      <Tabs.Title href="#react-two">Two</Tabs.Title>
    </Tabs.Container>
    <Tabs.Content target="react-tabs">
      <Tabs.Panel id="react-one">
        One!
      </Tabs.Panel>
      <Tabs.Panel id="react-two">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti quibusdam adipisci reiciendis tenetur aliquam minus, quia aspernatur velit soluta fuga sint dolorem temporibus eaque quis. Quam repellendus blanditiis tempore et.
      </Tabs.Panel>
    </Tabs.Content>
  </div>
);

ReactDOM.render(App, document.getElementById('react'))

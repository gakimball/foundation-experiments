import React from 'react';
import ReactDOM from 'react-dom';
import TabPlugin from './js/plugins/tabs';
import { Tabs, TabsTitle, TabsContent, TabsPanel } from './react/components/tabs';

new TabPlugin(document.querySelector('[data-tabs]'), {});

const App = (
  <div>
    <Tabs id="react-tabs" matchHeight>
      <TabsTitle href="#react-one">One</TabsTitle>
      <TabsTitle href="#react-two">Two</TabsTitle>
    </Tabs>
    <TabsContent target="react-tabs">
      <TabsPanel id="react-one">
        One!
      </TabsPanel>
      <TabsPanel id="react-two">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti quibusdam adipisci reiciendis tenetur aliquam minus, quia aspernatur velit soluta fuga sint dolorem temporibus eaque quis. Quam repellendus blanditiis tempore et.
      </TabsPanel>
    </TabsContent>
  </div>
);

ReactDOM.render(App, document.getElementById('react'))

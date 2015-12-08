import React from 'react'
import { render } from 'react-dom'
import { createHistory, useBasename } from 'history'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Less from '../less/total.less'

import Index from '../components/index'

render((
  <Index />
), document.getElementById('app'));


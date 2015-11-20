import React from 'react'
import { render } from 'react-dom'
import { createHistory, useBasename } from 'history'
import { Router, Route, Link, History, Redirect } from 'react-router'

import Less from '../less/total.less'

import Login from '../components/login'
import Register from '../components/register'
import Triple_Element from '../components/triple_element'
import Index from '../components/index'

render((<Index />), document.getElementById('app'));

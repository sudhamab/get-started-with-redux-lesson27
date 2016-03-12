import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import todoApp from './reducers'
import { Provider } from 'react-redux'
 
const Link = ({
  active,
  children,
  onClick
}) => {
  if(active) {
    return <span>{children}</span>;
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
    {children}
    </a>
  )
}

class FilterLink extends Component {

  /*
  ** unless you subscribe to it, the 
  ** store.getState() will get stale 
  ** values when the component re-renders.
  ** store.subscribe() returns a reference to store.unsubscribe()
  ** hence we can save this reference so that it can be called in the 
  ** componentWillUnmount() function later when the component unmounts
  ** 
  */

  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const {store} = this.context;
    /* get store state, not react state */
    const state = store.getState(); 

    return (
      <Link
        active = {
          props.filter 
            === state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
        >
          {props.children}
        </Link> 
    );
  }
}

FilterLink.contextTypes = {
  store: React.PropTypes.object
}

/* 
** Since the FilterLink gets the context. 
** we dont need to pass it down through the 
** footer component.
** Note that the FooterLink is a grandchild
** of the TodoApp.
** 
*/
const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
    All 
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
    >
    Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
    >
    Completed
    </FilterLink>
  </p>

)


/*
** Todo - PRESENTATIONAL COMPONENT Todo using 
** "stateless functional component syntax"
** One of the things to be done is to seprate out the 
** presentationl and the Behavioral components. 
** Functionl components can be defined even for the 
** presentational stuff which actually don't have any behavior 
** hence the name functional may sound confusing but 
** read this article 
** https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components
*/ 

const Todo = ({
  onClick,
  completed,
  text
}) => (

  <li 
    onClick={onClick} 
      style={{ 
        textDecoration:
          completed ?
            'line-through':
            'none'
      }}>
    {text}
  </li>
);


/*
** Note that VisibleTodoList is not a functional 
** component because functional components do not 
** have access to the lifeCycle methods that 
** React Components have. 
*/ 
class VisibleTodoList extends Component {

  componentDidMount() {
    /* take it from context instead of store */
    const { store } = this.context; 
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <TodoList 
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={id=>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id 
          })
        }
      />  
    )
  }
}

/*
** IMPORTANT:
** The context is opt in for the receiving context so you have to 
** specify  a special field called context types which are similar 
** to Child Context types but we need to specify context types 
** we want to receive and not pass down.
** IF you forget to specify the context types, the component will 
** not receive the context
*/ 

VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
}


/*
** TodoList - PRESENTATIONAL COMPONENT Todo using 
** "stateless functional component syntax" 
** Dan wants to keep the TodoList a presentational component
** but wants to encapsulate reading the currently visible
** todos into a separate container component that connects the todo list 
** to the redux store. This component will be the VisibleTodoList 
*/

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {
      todos.map(todo => 
        <Todo 
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
        />
    )}
  </ul>
);


/*
** FUNCTIONAL COMPONENTS don't have access to 'this'
** but they do get context as the second parameter
** So we get it as the second argument and destructure 
** the store from it. 
*/
const AddTodo = (props, { store }) => {
  let input;
  return(
    <div>
      <input ref={node => {
            input = node;
          }} />
      <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value
          })
        input.value = '';
      }}>
      Add Todo 
      </button>
    </div>
  );
};


/*
** Just like in the presentational components, 
** even for the functional components, we need 
** to specify the context types we expect to receive.
** Else they will not get the right context types
*/

AddTodo.contextTypes = {
  store: React.PropTypes.object
}

/*
** NOTE: the following is just a utility function, 
** versus a functional component such as FilterLink
** I am stating the obvious here but this is so 
** as to just bring your attention to the little details 
** because with similarities in syntax, the difference 
** in purpose is sometimes not obvious.
*/

const getVisibleTodos = (
  todos, 
  filter
  ) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos;
      case 'SHOW_COMPLETED':
        return todos.filter( t => t.completed);
      case 'SHOW_ACTIVE':
        return todos.filter( t => !t.completed);
      default:
        return todos;
    }
}

let nextTodoId = 0;

/*
** We remove the store being passed through as pops 
** explicityly because they are implicitly passed 
** down through the context. This takes care of the 
** problem of pass through 
*/ 
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList/>
    <Footer/>
  </div>
);

/*
** For sake of understanding the problem, we pass in the store as a props
** to the top level component.

*/ 
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);



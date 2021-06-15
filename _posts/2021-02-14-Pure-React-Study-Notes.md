---
title: Pure React Study Notes
tags:
  - React
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Learn some React basics.

## JSX

JSX hello world example

```js
import React from 'react'; 
import ReactDOM from 'react-dom';

function HelloWorld() {
  return (<div>Hello World!</div>);
}

ReactDOM.render(<HelloWorld/>, document.querySelector('#root'));
```

### 1. JSX is compiled to JavaScript as a function by Babel

```js
function SongName(props) { 
    return ( 
        <span className='song-name'>
            {props.song.name} 
        </span> 
    );
}

// compiles to 
function SongName(props) {
  return (React.createElement(
        'span', 
        {className: 'song-name' }, 
        props.song.name
    ));
}
```

The `React.createElement` function signature looks like this:

```js
React.createElement( string|element, [propsObject], [children...] )
```

### 2. Wrap JSX return statement with a Tag

The following code won't compile

```js
function HelloWorld() { 
    return (<Hello/> <World/>); 
}
```

Because it returns two things at once, which is wrong, looks like:

```js
function HelloWorld() {
    return ( React.createElement(Hello, null) React.createElement(World, null));
}
```

Conclusions:

1. Wrap With `<div><MyStuff /></div>`, works for most of the time

2. If `<div>` is not an option, React’s answer is the `Fragment` (since React 16.2). After rendering, the `React.Fragment` component will “disappear”.

    ```js
    function NameCells() {
        return ( 
            <React.Fragment> 
                <td>First Name</td> 
                <td>Last Name</td> 
            </React.Fragment> 
        );
    }
    ```

3. `<></>` syntax is the preferred way to write fragments

### 3. Javascript in JSX

JS inside the braces must be an expression (not a statement). Or say, it produces a value.

Expression vs Statement

- Expression returns a value no matter what. E.g.,

    ```js
    1+1 // return 2
    thisIsAMethodCall() // return a value, null or sth
    thisIsAMethodReference // return a reference
    ```

- Statement does not produce values and can’t be used inside JSX

    ```js
    const a = 5  // no return value
    if(true){haha();} 
    ```

### 4. Passing Props to a component

Like HTML elements have “attributes,” React components have “props”.
Props let you pass data to your components.

1. Passing Props

    ```js
    function Dave() { 
        const firstName = "Dave"; // author of the book "Pure React"
        const lastName = "Ceddia";// a beautiful book
        return ( 
            <Person 
                className='person' 
                age={33} 
                name={firstName + ' ' + lastName} /> );
    }
    ```

2. Receiving props using ES6 destructuring

    ```js
    const Hello = (props) => { 
        const { name } = props; 
        return ( <span>Hello, {name}</span> ); 
    }
    ```

    ```js
    const Hello = ({ name }) => ( <span>Hello, {name}</span> );
    ```

3. Updating props

    **Props are read-only**.

    If a child needs to send the updated data to its parent, the parent can send down a function as a prop.
    The child would call the function reference to notify the parent that sth has happened.

4. What to pass? How exactly should you pass?

    should you pass an object and let the component extract what it needs?
    Or should you pass the specific pieces of data that the component requires?

    **Answer is passing the specific pieces**.

    - For reusability - If the child expects an object with a property , then it’s locked in to that structure.
    - For flexibility - The child component should have no knowledge of the inner structure of a parent object. It’s a good idea to keep the knowledge of data structures contained to as few places as possible to reduce the cost of change.

### 5. PropTypes

1. Use ESLint

    **ESLint** helps checking for things like missing `PropTypes` and that `props` are passed correctly.

2. Common types

    ```js
    PropTypes.array
    PropTypes.bool
    PropTypes.func
    PropTypes.number
    PropTypes.object
    PropTypes.string
    ```

3. node & element

    - `PropTypes.node`
        - A `node` is anything that can be rendered, meaning numbers, strings, elements, or an array of those.
        - component to accept zero, one, or more children
    - `PropTypes.element`
        - An `element` is a React element created with `JSX` or by calling `React.createElement`
        - want to accept only a single child

4. property validator

    - `PropTypes.instanceOf(SpecificClass)`
    - `PropTypes.oneOf(['person', 'place', 1234])` limit to specific values
    - `PropTypes.arrayOf(PropTypes.string)` it’s an array of a certain type
        - Would match: `['a', 'b', 'c']`
        - Would not match: `['a', 'b', 42]`
    - `PropTypes.objectOf(PropTypes.number)` properties are values of a certain type
        - Would match: `{age: 27, birthMonth: 9}`
        - Would not match: `{age: 27, name: 'Joe'}`
    - `PropTypes.shape({ name: PropTypes.string, age: PropTypes.number })` an object has a certain shape. The object passed to this prop is allowed to have extra properties too, but it must at least have the ones in the shape description.

    ```js
    function Author({ author }) { 
        const { name, handle } = author;

        return (
            <span className="author">
                <span className="name">{name}</span>
                <span className="handle">@{handle}</span>
            </span> );
    }

    Author.propTypes = { 
        author: PropTypes.shape({ 
            name: PropTypes.string.isRequired, 
            handle: PropTypes.string.isRequired 
            }).isRequired 
    };
    ```

5. How explicit should you be?

- follow the DRY (Don’t Repeat Yourself) principle.
- If you go overboard with shape it could be a pain to maintain later.
- If you have an explicit object shape required in one place, there’s little value in duplicating the shape in the parent component.

### 6. The “key” Prop

React uses `key` to tell components apart when **reconciling** differences during a re-render.

keys should be stable, permanent, and unique for each element in the array
    - **Stable**: An element should always have the same key, regardless of its position in the array. This means `key={index}` is a bad choice.
    - **Permanent**: An element’s key must not change between renders. This means `key={Math.random()}` or `key={UUID}` is a bad choice.
    - **Unique**: No two elements should have the same key. If items don't have unique id, try combining several fields.

## 2. React State

`props` are read-only. You need `state` to keep track of data change.

React has two ways of adding state to components:

- maintain state in Class component
- use hooks to add state directly to a function component

### 1. setState in Class Component

Two ways of setState here: `setState` accepts an object, and `setState` accepts a function.

1. `setState` accepts an object.

    The `setState` function will update the state and then re-render the component and all of its children.

    ```js
    class CountingParent extends React.Component {

        state = { actionCount: 0 };

        handleAction = (action) => {
            this.setState({ actionCount: this.state.actionCount + 1 });
        }
        // sth else ...
    }
    ```

2. Functional `setState`.

    You pass a function to `setState` instead of an object. The function receives the current state and props as arguments, and it is expected to return an object, which will be merged with the old state.

    ```js
    this.setState((state, props) => { 
        return { value: state.value + 1 } }
    );
    ```

3. Prefer functinal setState

    - it’s guaranteed to work correctly (in correct order) //todo moss setState is Aync
    - functional `setState` are “pure” functions – that is, they only operate on their arguments, they don’t modify the arguments, and they return a new value.

### 2. Class Component lifecycle

Phases: Mount, Render, Commit and Unmount.

1. **Mount**
    - when the component is first added to the DOM.
    - Initialization and setup are done here.
    - These methods are called **only once**, when the component first mounts.
      - constructor
      - `componentDidMount`
        - Called immediately after the first render.
        - The component’s children are already rendered at this point.
        - This is a good place to make AJAX requests to fetch any data you need.
    - `componentWillMount` **deprecated**. Use `componentDidMount` instead.

2. **Rendering** These are called, in order, before and after **each render**
    - `componentWillReceiveProps(nextProps)` deprecated. Use `getDerivedStateFromProps` instead.
    - `static getDerivedStateFromProps(nextProps, prevState)` This method must not have side effects. Don’t call setState here, but instead, return an object that represents the new state.
    - `shouldComponentUpdate(nextProps, nextState)`: an opportunity to prevent rendering if you know that props and state have not changed.
    - `componentWillUpdate(nextProps, nextState)` deprecated. Use `getSnapshotBeforeUpdate`
    - `render` between `componentWillUpdate` and `componentDidUpdate`. Despite its name, the render phase doesn’t change what you see on the page.
    - `getSnapshotBeforeUpdate(prevProps, prevState)`: This is called after `render`, but before the changes are committed to the DOM. Use it to pass along anything you need to keep track of between DOM updates, e.g., tracking changes to scroll position.
    - `componentDidUpdate(prevProps, prevState, snapshot)`: Render is done. DOM changes have been committed.

3. Commit takes the output from render and updates the DOM to match.

4. Unmount happens when the component is being removed from the DOM.
    - `componentWillUnmount`: The component is about to be unmounted.
    - Maybe its item was removed from a list, maybe the user navigated to another tab
    - this method will only get called if componentDidMount was called.

5. **Error Handling**
    - `componentDidCatch`: This method is called when a child component or one of its children throws an error

### 3. State in Functions, aka Hooks

- **Class components** have one big state object, and a function `this.setState()` to change the whole thing at once (plus it shallow-merges the new value).

- In **functional component** there’s no state either component-wide setState function. we create pieces of state in a sort of ad-hoc way, we create a small function to update this piece of state. **one value, one function**.

The useState hook takes the initial state as an argument and it returns an array with 2 elements: the current state, and a function to change the state.

If your state is a complex value like an object or array, you need to take care, when updating it, to copy in all the other parts that you don’t intend to change. The `...` spread operator is a big help for making copies of arrays and objects.

Rule of hooks

1. Only call hooks at the top level of your function. Don’t put them in loops, conditionals, or nested functions.
2. Only call hooks from React function components, or from custom hooks. Don’t call them from outside a component.

### 4. Thinking in State

1. Component state is for storing UI state – things that affect the visual rendering of the page. If modifying a piece of data does not visually change the component, that data shouldn’t go into state.

    Good to be in state:

    - User-entered input (values of text boxes and other form fields)
    - Current or selected item (the current tab, the selected row)
    - Data from the server (a list of products, the number of “likes” on a page)
    - Open/closed state (modal open/closed, sidebar expanded/hidden)

    Not good to be in state:

    - handles to timers and event handlers, should be stored on the component instance itself, store them in `this` object available in class components

2. State can initialize values from the `prop` which the component will then control

3. Avoid copying `props` into `state`. It creates a second source of truth for your data, which usually leads to bugs. A component will receive fresh props from its parent every time it re-renders.

    ```js
    // Don't do this:
    class BadExample extends Component { 
        state = { data: this.props.data }
    }

    // Do this instead:
    class GoodExample extends Component {
        render() { 
            return ( <div>The data: {this.props.data}</div> ) 
        }
    }
    ```

4. Try to keep the state in a parent component. Having fewer components containing state means fewer places to look when a bug appears.

### 5. setState Is Asynchronous // todo moss + context API

If you call setState and immediately console.log(this.state) right afterwards, it will very likely print the old state instead of the one you just set.
each call to setState “queues” an update in the order they’re called, and when they’re executed, they receive the latest state as an argument instead of using a potentially-stale this.state.

```js
// Assume state is { count: 3 }
// Then call setState: this.setState({ count: 4 });
// Then try to print the "new" state: console.log(this.state);
// It'll likely print { count: 3 } // instead of { count: 4 }
```

If you need to set the state and immediately act on that change, you can pass in a callback function as the second argument to setState, like this:

```js
this.setState({name: 'Joe'}, function() { 
    // called after state has been updated 
    // and the component has been re-rendered 
    // this.state now contains { name: 'Joe' } 
});
```

### 6. Thinking declaratively, not imperatively

It's quite intuitive to pass pros down and send events up. However, some “event-based” things, may regard as imperative scenarios, e.g.,

- Open a modal dialog?
- Or display a popup notification in the corner?
- Or animate an icon in response to an event?

1. Expanding/Collapsing an Accordion control
   - Old way: Clicking a toggle button opens or closes the accordion by calling its toggle function. The Accordion knows whether it is open or closed.
   - **The declarative way**: let the Accordion parent store the value in component’s state (not inside the Accordion) and decice whether open or close it. We tell the Accordion which way to render by passing `isOpen` as a prop. When `isOpen` is true, it renders as open. When `isOpen` is false, it renders as closed. 

    ```js
    <Accordion isOpen={true}/>
    ```

   - The biggest difference is that instead of the Accordion instinctively (and internally) knowing whether it is open or closed, it is told to be open or closed by whichever component renders the Accordion.

2. Opening and Closing a Dialog
    - The old way: Clicking a button opens the modal. Clicking its Close button closes it.
    - **The declarative way**: the Modal's parent holds the state, either open or close. So, if it’s “open”, we render the Modal. If it’s “closed” we don’t render the modal. Moreover, we can pass an onClose callback to the Modal – this way the parent component gets to decide what happens when the user clicks Close.

        ```js
        <div> {this.state.isModalOpen &&
            <Modal onClose={this.handleClose}/>}
        </div>
        ```

3. Notifications
    - The old way: When an event occurs (like an error), call a notification library to display a popup, like `toastr.error("Oh no!")`.
    - **The declarative way**: Think of notifications as state. There can be 0 notifications, or 1, or 2… Store those in an array. Put a NotificationTray component somewhere near the root of the app, and pass it the messages to display. You can manage the array of messages in the root component’s state, and pass an addNotification prop down to components that need to be able to surface notifications.

4. Animating a Change

    Let’s say you have a badge with a counter showing the number of logged-in users. It gets this number from a prop. What if you want the badge to animate when the number changes?

    - The old way: You might use jQuery to toggle a class that plays the animation, or use jQuery to animate the element directly.
    - **The declarative way**: You can respond when props change by implementing the `componentDidUpdate` lifecycle method and comparing the old value to the new one. If the value changed, you can set the “animating” state to true. Then in render, when “animating” is true, set a CSS class that triggers the animation. When “animating” is false, don’t set that class.

## 3. Components and project structures

### 1. Presentational vs Container components

Architecturally, you can segment components into two kinds: **Presentational** (a.k.a “Dumb”) and **Container** (a.k.a. “Smart”).

**Presentational components are stateless**.

- They simply accepts props and render some elements based on those props.
- A stateless component will generally contain less logic, and will be easier to debug and test.
- They are pure functions. They always return the same result for a given set of props, and they don’t change anything.
- Ideally, most of your components will be presentational.
- think about Child components. They accept data and render it, and if events need to be handled, they call back up to the parent.
- Other kinds of common presentational components include buttons, navigation bars, links, images, etc.

**Container components are stateful**.

- They maintain state for themselves and any child components, and pass it down to them via props.
- They usually pass down handler functions to children, and respond to callbacks by updating their internal state.
- Container components are also responsible for asynchronous communication, such as AJAX calls to the server.
- Think about Parent components.

Presentational components can contain Container components, and Containers can contain Presentational components – there aren’t any strict rules for nesting.

- In an ideal world, you’d try to organize your app so that the components at a top level are containers.
- In the real world this is difficult to achieve because you might have nested inputs that contain their own state, or more complicated requirements.

### 2. Project structures

// todo moss

## References

- [How Java Servlet Works](https://examples.javacodegeeks.com/how-java-servlet-works/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+JavaCodeGeeks+%28Java+Code+Geeks%29)
- [Java Servlet Technology](https://javaee.github.io/tutorial/servlets.html#BNAFD)

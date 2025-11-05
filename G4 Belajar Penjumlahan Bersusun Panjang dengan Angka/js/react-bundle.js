// React Bundle - Minimal implementation for offline use
// This bundle includes only the essential React functionality needed

(function(global) {
  'use strict';

  // React internal state management
  let currentComponent = null;
  let hookIndex = 0;
  let hooks = [];

  // createElement function
  function createElement(type, props, ...children) {
    // Handle React.Fragment shorthand
    if (type === Fragment || type === 'React.Fragment') {
      type = Fragment;
    }
    
    const element = {
      type,
      props: {
        ...props,
        children: children.length <= 1 ? children[0] : children
      }
    };
    return element;
  }

  // useState hook
  function useState(initialState) {
    const currentHookIndex = hookIndex++;
    
    if (!hooks[currentHookIndex]) {
      hooks[currentHookIndex] = {
        state: typeof initialState === 'function' ? initialState() : initialState,
        setState: (newState) => {
          const oldState = hooks[currentHookIndex].state;
          hooks[currentHookIndex].state = typeof newState === 'function' ? newState(oldState) : newState;
          scheduleRerender();
        }
      };
    }
    
    return [hooks[currentHookIndex].state, hooks[currentHookIndex].setState];
  }

  // useEffect hook
  function useEffect(callback, dependencies) {
    const currentHookIndex = hookIndex++;
    
    if (!hooks[currentHookIndex]) {
      hooks[currentHookIndex] = { dependencies: undefined, cleanup: null };
    }
    
    const hasChanged = !dependencies || 
      !hooks[currentHookIndex].dependencies ||
      dependencies.some((dep, i) => dep !== hooks[currentHookIndex].dependencies[i]);
    
    if (hasChanged) {
      if (hooks[currentHookIndex].cleanup) {
        hooks[currentHookIndex].cleanup();
      }
      
      const cleanup = callback();
      hooks[currentHookIndex].cleanup = cleanup;
      hooks[currentHookIndex].dependencies = dependencies;
    }
  }

  // useCallback hook
  function useCallback(callback, dependencies) {
    const currentHookIndex = hookIndex++;
    
    if (!hooks[currentHookIndex]) {
      hooks[currentHookIndex] = { callback, dependencies };
    }
    
    const hasChanged = !dependencies ||
      !hooks[currentHookIndex].dependencies ||
      dependencies.some((dep, i) => dep !== hooks[currentHookIndex].dependencies[i]);
    
    if (hasChanged) {
      hooks[currentHookIndex].callback = callback;
      hooks[currentHookIndex].dependencies = dependencies;
    }
    
    return hooks[currentHookIndex].callback;
  }

  // useMemo hook
  function useMemo(factory, dependencies) {
    const currentHookIndex = hookIndex++;
    
    if (!hooks[currentHookIndex]) {
      hooks[currentHookIndex] = { value: undefined, dependencies: undefined };
    }
    
    const hasChanged = !dependencies ||
      !hooks[currentHookIndex].dependencies ||
      dependencies.some((dep, i) => dep !== hooks[currentHookIndex].dependencies[i]);
    
    if (hasChanged) {
      hooks[currentHookIndex].value = factory();
      hooks[currentHookIndex].dependencies = dependencies;
    }
    
    return hooks[currentHookIndex].value;
  }

  // useRef hook
  function useRef(initialValue) {
    const currentHookIndex = hookIndex++;
    
    if (!hooks[currentHookIndex]) {
      hooks[currentHookIndex] = { current: initialValue };
    }
    
    return hooks[currentHookIndex];
  }

  // useReducer hook
  function useReducer(reducer, initialArg, init) {
    const currentHookIndex = hookIndex++;
    
    if (!hooks[currentHookIndex]) {
      const initialState = init ? init(initialArg) : initialArg;
      hooks[currentHookIndex] = {
        state: initialState,
        dispatch: (action) => {
          const newState = reducer(hooks[currentHookIndex].state, action);
          if (newState !== hooks[currentHookIndex].state) {
            hooks[currentHookIndex].state = newState;
            scheduleRerender();
          }
        }
      };
    }
    
    return [hooks[currentHookIndex].state, hooks[currentHookIndex].dispatch];
  }

  // useLayoutEffect hook (synchronous version of useEffect)
  function useLayoutEffect(callback, dependencies) {
    const currentHookIndex = hookIndex++;
    
    if (!hooks[currentHookIndex]) {
      hooks[currentHookIndex] = { dependencies: undefined, cleanup: null };
    }
    
    const hasChanged = !dependencies || 
      !hooks[currentHookIndex].dependencies ||
      dependencies.some((dep, i) => dep !== hooks[currentHookIndex].dependencies[i]);
    
    if (hasChanged) {
      if (hooks[currentHookIndex].cleanup) {
        hooks[currentHookIndex].cleanup();
      }
      
      // Execute synchronously (before paint)
      const cleanup = callback();
      hooks[currentHookIndex].cleanup = cleanup;
      hooks[currentHookIndex].dependencies = dependencies;
    }
  }

  // useId hook
  let idCounter = 0;
  function useId() {
    const currentHookIndex = hookIndex++;
    
    if (!hooks[currentHookIndex]) {
      hooks[currentHookIndex] = { id: `react-id-${++idCounter}` };
    }
    
    return hooks[currentHookIndex].id;
  }

  // React.Fragment
  const Fragment = Symbol('react.fragment');

  // forwardRef
  function forwardRef(render) {
    const ForwardRefComponent = (props) => {
      return render(props, props.ref);
    };
    ForwardRefComponent.$$typeof = Symbol('react.forward_ref');
    ForwardRefComponent.render = render;
    return ForwardRefComponent;
  }

  // React.memo
  function memo(Component, areEqual) {
    const MemoComponent = (props) => {
      const currentHookIndex = hookIndex++;
      
      if (!hooks[currentHookIndex]) {
        hooks[currentHookIndex] = { 
          lastProps: props, 
          lastResult: Component(props) 
        };
        return hooks[currentHookIndex].lastResult;
      }
      
      const shouldUpdate = areEqual 
        ? !areEqual(hooks[currentHookIndex].lastProps, props)
        : !shallowEqual(hooks[currentHookIndex].lastProps, props);
      
      if (shouldUpdate) {
        hooks[currentHookIndex].lastProps = props;
        hooks[currentHookIndex].lastResult = Component(props);
      }
      
      return hooks[currentHookIndex].lastResult;
    };
    
    MemoComponent.$$typeof = Symbol('react.memo');
    MemoComponent.type = Component;
    return MemoComponent;
  }

  // Helper function for shallow comparison
  function shallowEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    
    return true;
  }

  // Error Boundary simple implementation
  function ErrorBoundary({ children, fallback, onError }) {
    // Use a simple approach - wrap children in try-catch during rendering
    try {
      return children;
    } catch (error) {
      if (onError) {
        onError(error, { componentStack: error.stack });
      }
      
      return fallback || createElement('div', { 
        style: { 
          color: 'red', 
          padding: '20px', 
          border: '1px solid red',
          borderRadius: '4px',
          backgroundColor: '#fee'
        } 
      }, `Error: ${error.message}`);
    }
  }

  // Create a HOC version of ErrorBoundary for easier use
  function withErrorBoundary(Component, errorBoundaryConfig = {}) {
    return function WrappedComponent(props) {
      return createElement(ErrorBoundary, errorBoundaryConfig, 
        createElement(Component, props)
      );
    };
  }

  // Simple scheduler for re-rendering
  let isScheduled = false;
  function scheduleRerender() {
    if (!isScheduled) {
      isScheduled = true;
      setTimeout(() => {
        isScheduled = false;
        if (currentComponent && currentComponent.rerender) {
          currentComponent.rerender();
        }
      }, 0);
    }
  }

  // Render function to convert React elements to DOM
  function renderElement(element, container) {
    try {
      if (element === null || element === undefined || element === false) {
        return;
      }
      
      if (typeof element === 'string' || typeof element === 'number') {
        const textNode = document.createTextNode(element.toString());
        container.appendChild(textNode);
        return;
      }
      
      if (Array.isArray(element)) {
        element.forEach(child => renderElement(child, container));
        return;
      }

      // Handle React.Fragment
      if (element.type === Fragment) {
        if (element.props && element.props.children) {
          renderElement(element.props.children, container);
        }
        return;
      }
      
      if (typeof element.type === 'function') {
        // Component
        hookIndex = 0;
        let componentResult;
        
        // Handle forwardRef components
        if (element.type.$$typeof === Symbol('react.forward_ref')) {
          componentResult = element.type.render(element.props, element.props.ref);
        } else {
          componentResult = element.type(element.props);
        }
        
        renderElement(componentResult, container);
        return;
      }
      
      // Handle class components (for Error Boundaries)
      if (typeof element.type === 'function' && element.type.prototype && element.type.prototype.render) {
        const instance = new element.type(element.props);
        const componentResult = instance.render();
        renderElement(componentResult, container);
        return;
      }
      
      // DOM element
      const domElement = document.createElement(element.type);
      
      // Set properties
      if (element.props) {
        Object.keys(element.props).forEach(key => {
          if (key === 'children') {
            return;
          }
          
          if (key === 'ref' && element.props[key]) {
            // Handle refs
            if (typeof element.props[key] === 'function') {
              element.props[key](domElement);
            } else if (element.props[key] && typeof element.props[key] === 'object') {
              element.props[key].current = domElement;
            }
          } else if (key === 'style' && typeof element.props[key] === 'object') {
            Object.assign(domElement.style, element.props[key]);
          } else if (key.startsWith('on') && typeof element.props[key] === 'function') {
            const eventName = key.toLowerCase().substring(2);
            domElement.addEventListener(eventName, element.props[key]);
          } else if (key === 'className') {
            domElement.className = element.props[key];
          } else if (key === 'htmlFor') {
            domElement.htmlFor = element.props[key];
          } else if (key === 'value' || key === 'checked' || key === 'selected') {
            domElement[key] = element.props[key];
          } else if (key !== 'ref') {
            domElement.setAttribute(key === 'htmlFor' ? 'for' : key, element.props[key]);
          }
        });
        
        // Render children
        if (element.props.children) {
          renderElement(element.props.children, domElement);
        }
      }
      
      container.appendChild(domElement);
    } catch (error) {
      // Basic error boundary fallback
      console.error('React rendering error:', error);
      const errorElement = document.createElement('div');
      errorElement.style.color = 'red';
      errorElement.style.padding = '10px';
      errorElement.style.border = '1px solid red';
      errorElement.textContent = 'Component Error: ' + error.message;
      container.appendChild(errorElement);
    }
  }

  // ReactDOM.createRoot equivalent
  function createRoot(container) {
    let currentElement = null;
    
    const root = {
      render: (element) => {
        currentElement = element;
        container.innerHTML = '';
        hookIndex = 0;
        hooks = [];
        
        // Set up rerender function
        currentComponent = {
          rerender: () => {
            container.innerHTML = '';
            hookIndex = 0;
            renderElement(currentElement, container);
          }
        };
        
        renderElement(element, container);
      }
    };
    
    return root;
  }

  // Export React and ReactDOM objects
  global.React = {
    createElement,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    useReducer,
    useLayoutEffect,
    useId,
    Fragment,
    forwardRef,
    memo,
    ErrorBoundary,
    withErrorBoundary
  };

  global.ReactDOM = {
    createRoot
  };

})(window); 
class IndecisionApp extends React.Component {
    constructor(props) {
        super(props);
        this.handleDeleteOptions = this.handleDeleteOptions.bind(this);
        this.handlePick = this.handlePick.bind(this);
        this.handleAddOption = this.handleAddOption.bind(this);
        this.handleDeleteOption = this.handleDeleteOption.bind(this);
        this.state = {
            options: props.options
        };
    }

    componentDidMount() {
        const json = localStorage.getItem('options');
        const options = JSON.parse(json);

        try {
            if (options) {
                this.setState(() => ({options}));
            }
        } catch (e) {
            // No implementation. Intentional.
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.options.length !== this.state.options.length) {
            const json = JSON.stringify(this.state.options)
            localStorage.setItem('options', json)
        }
        
    }

    handleDeleteOptions() {
        this.setState(() => ({options: [] }));
    }

    handleDeleteOption(optionToRemove) {
        this.setState((prevState) => ({ 
            options: prevState.options.filter((option) =>  optionToRemove !== option ) 
        }));
    }

    handlePick() {
        const randomNum = Math.floor(Math.random() * this.state.options.length );
        const option = this.state.options[randomNum];
        alert(option);
    }

    handleAddOption(option) {
        if (!option) {
            return 'Enter valid value to add options';
        } else if (this.state.options.indexOf(option) > -1) {
            return 'This option already exists'
        } 

        this.setState((prevState) => ({ options:prevState.options.concat(option) }));
    }

    render() {
        const subtitle = 'Put your life in the hands of the computer';

        return (
            <div>
                <Header subtitle={subtitle}/>
                <Action 
                    hasOptions={this.state.options.length > 0} 
                    handlePick={this.handlePick}
                />
                <Options 
                    options={this.state.options}
                    handleDeleteOptions={this.handleDeleteOptions}
                    handleDeleteOption={this.handleDeleteOption}
                />
                <AddOption 
                    handleAddOption={this.handleAddOption}
                />
            </div>
        );
    }
}

IndecisionApp.defaultProps = {
    options: []
};

// class Header extends React.Component {
//     render() {
//         return (
//             <div>
//                 <h1>{this.props.title}</h1>
//                 <h2>{this.props.subtitle}</h2>
//             </div>
//         );
//     }
// }

const Header = (props) => {
    return (
        <div>
            <h1>{props.title}</h1>
            {props.subtitle && <h2>{props.subtitle}</h2>}
        </div>
    );
};

Header.defaultProps = {
    title: "Indecision"
}

// class Action extends React.Component {
//     render() {
//         return (
//             <div>
//                 <button onClick={this.props.handlePick} disabled={!this.props.hasOptions}>
//                     What should I do?
//                 </button>
//             </div>
//         );
//     }
// }

const Action = (props) => {
    return (
        <div>
            <button onClick={props.handlePick} disabled={!props.hasOptions}>
                What should I do?
            </button>
        </div>
    );
};

// class Options extends React.Component {
//     render() {
//         return (
//             <div>
//                 <button onClick={this.props.handleDeleteOptions}>Remove all</button>
//                 {
//                     this.props.options.map( (option) => <Option key={option} optionText={option}/> )
//                 }
//                <Option />
//             </div>
//         );
//     }
// }

const Options = (props) => {
    return (
        <div>
            <button onClick={props.handleDeleteOptions}>Remove all</button>
            {props.options.length === 0 && <p>Please, add an option to get started!</p>}
            {
                props.options.map( (option) => (
                    <Option 
                        key={option} 
                        optionText={option}
                        handleDeleteOption={props.handleDeleteOption}
                    />
                ))
            }
           <Option />
        </div>
    ); 
}

// class Option extends React.Component {
//     render() {
//         return (
//             <div>
//                 {this.props.optionText}
//             </div>
//         );
//     }
// }

const Option = (props) => {
    return (
        <div>
            {props.optionText}
            {props.optionText && <button 
                onClick={(e) => {
                    props.handleDeleteOption(props.optionText);
                }}
            >
                Remove
            </button>}
        </div>
    );
}

class AddOption extends React.Component {
    constructor(props) {
        super(props)
        this.handleAddOption = this.handleAddOption.bind(this);
        this.state = {
            error: undefined
        }
    }

    handleAddOption(e) {
        e.preventDefault();

        const option = e.target.elements.add_option.value.trim()
        const error = this.props.handleAddOption(option);

        this.setState(() => ({ error }));

        if (!error) {
           e.target.elements.add_option.value = ''; 
        }
        
    }

    render() {
        return (
            <div>
               {this.state.error && <p>{this.state.error}</p>}
               <form onSubmit={this.handleAddOption}>
                    <input type="text" name="add_option"/>
                    <button>Add Option</button>
               </form>
            </div>
        );
    }
}


// const User = (props) => {
//     return (
//         <div>
//             <p>Name: {props.name}</p>
//             <p>Age: {props.age}</p>
//         </div>
//     );
// };


ReactDOM.render(<IndecisionApp options={['Option One', 'Option Two']}/>, document.getElementById('app'));
import React, {
  Component,
  PropTypes
} from 'react';
import RichTextEditor from 'react-rte';

class RichTextMarkdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: undefined
    }
  }

  componentDidMount() {
    this.RichTextEditor = RichTextEditor;
    this.setState({
      value: this.props.initialVal ? this.RichTextEditor.createValueFromString(this.props.initialVal, 'html') : this.RichTextEditor.createEmptyValue()
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialVal && this.props.initialVal !== nextProps.initialVal) {
      this.setState({
        value: this.RichTextEditor.createValueFromString(nextProps.initialVal, 'html')
      })
    }
  }

  handleChange = value => {
    this.setState({
      value
    })
    let markdown = value.toString('html')
    if (markdown.length === 2 && markdown.charCodeAt(0) === 8203 && markdown.charCodeAt(1) === 10) {
      markdown = ''
    }
    this.props.input.onChange(markdown)
  }

  render() {
    const {
      RichTextEditor,
      state: {
        value
      },
      handleChange
    } = this;

    return RichTextEditor ?
      <RichTextEditor 
        {...this.props}
        value={value}
        onChange={handleChange}/> : <div/>;
  }
}

export default RichTextMarkdown;

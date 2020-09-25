import React from 'react'

class Floater extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      style: {
        left: 0,
        top: 0,
      },
    }

    this.menuRef = React.createRef()
  }

  componentDidMount() {
    this.setState({
      style: this.calculateStyle(this.props),
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      style: this.calculateStyle(nextProps),
    })
  }

  render() {
    return (
      <div ref={this.menuRef} className="floater" style={this.state.style}>
        {this.props.children}
      </div>
    )
  }

  calculateStyle(props) {
    const { view } = props
    const { selection } = view.state

    let mathNodeIsSelected =
      selection.node &&
      selection.node.type &&
      selection.node.type.name &&
      (selection.node.type.name === 'math_block' ||
        selection.node.type.name === 'math_inline')

    if (!selection || selection.empty || mathNodeIsSelected) {
      return {
        left: -1000,
        top: 0,
      }
    }

    const { offsetWidth, offsetHeight } = this.menuRef.current
    const anchor = view.coordsAtPos(selection.$anchor.pos)
    const scrollY = window.scrollY

    var top =
      anchor.top - 10 > 0
        ? anchor.top - 110 + scrollY - offsetHeight
        : anchor.top + 20

    var left =
      window.innerWidth - offsetWidth < anchor.left
        ? anchor.left - offsetWidth - 120
        : anchor.left

    if (left < 5) {
      left = 5
    }

    return {
      left: left,
      top: top,
    }
  }
}

export default Floater

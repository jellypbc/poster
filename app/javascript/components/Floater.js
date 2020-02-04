import React from 'react'

class Floater extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      style: {
        left: 0,
        top: 0
      }
    }

    this.menuRef = React.createRef()
  }

  componentDidMount() {
    this.setState({
      style: this.calculateStyle(this.props)
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      style: this.calculateStyle(nextProps)
    })
  }

  render() {
    return (
      <div ref={this.menuRef} className="floater" style={this.state.style}>
        {this.props.children}
      </div>
    )
  }

  calculateStyle (props) {
    const { view } = props
    const { selection } = view.state

    if (!selection || selection.empty) {
      return {
        left: -1000,
        top: 0
      }
    }

    const { offsetWidth } = this.menuRef.current
    const anchor = view.coordsAtPos(selection.$anchor.pos)
    const scrollY = window.scrollY

    var top = anchor.top - 120 > 0 ? anchor.top - 120 + scrollY : anchor.top + 20
    var left = window.innerWidth - offsetWidth < anchor.left ? anchor.left - offsetWidth + 20 : anchor.left

    if ( left < 5 ) {
      left = 5;
    }

    return {
      left: left,
      top: top
    }
  }
}

export default Floater

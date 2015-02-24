import _ from "lodash"
import React from "react/addons"
import createSideEffect from "react-side-effect"

var _serverMeta = null

/**
 * Get the meta tag data objects from the specified children of the DocumentMeta object
 * @param  {React.Children} children  Children to fetch data from
 * @return {Array}                    Array of child meta data objects
 */   
function metaTagDataFromChildren(children) {
  let childProps = React.Children.map(children, (child) => {
    if(!(child.type && child.type.displayName === "MetaTag"))
      throw new Error("All children of \"DocumentMeta\" element must be of type \"MetaTag\".")

    return child.props
  })

  return _(childProps)
    .map((val) => {
      if(val.name) {
        return [val.name, val]
      } else {
        return [val.property, val]  
      }
    })
    .object()
    .value()
}

/**
 * Reduce meta tag data from all mounted instances.
 * @param  {Array} propsList  A list of all props from all mounted instances
 * @return {Object}           An object of the form { [name or property]: properties } representing meta tag data.
 */
function getMetaTagsFromPropsList(propsList) {
  let childMetaTags = _.map(propsList, (list) => {
    return metaTagDataFromChildren(list.children)
  })

  return _.reduce(childMetaTags, (merged, obj) => _.assign({}, merged, obj))
}

/*
  Dummy class that represents a Meta tag. Takes name or property and content as props. Renders nothing.
 */
export var MetaTag = React.createClass({
  displayName: "MetaTag",

  propTypes: {
    name: React.PropTypes.string,
    property: React.PropTypes.string,
    content: React.PropTypes.string.isRequired
  },

  render() {
    return null
  }
})

/*
  Document Meta declaritively represents meta tags in React.

  On the client, it modifies the meta tags with JS.
  On the server, it returns a string of meta tags that can be outputted in a template.

  Example: 
  --------
  <DocumentMeta>
    <MetaTag property="og:title" content="A sample Open Graph Title" />
    <MetaTag property="description" content="This is a sample description" />
  </DocumentMeta>
 */
export var DocumentMeta = createSideEffect(function handleChange(propsList) {
  let metaTags = getMetaTagsFromPropsList(propsList)

  // TODO: Improve the diffing here
  if(typeof document !== "undefined") { //in browser
    let metaTagNodes = document.querySelectorAll(`meta[data-document-meta='true']`)
    for(let tag of metaTagNodes) {
      tag.parentNode.removeChild(tag)
    }
    _.forEach(metaTags, (properties, nameOrProperty) => {
      let {name, property, content} = properties

      let newMetaTag = document.createElement("meta")
      newMetaTag.content = content

      if(name)
        newMetaTag.name = name
      else if(property)
        newMetaTag.setAttribute("property", property)

      newMetaTag.setAttribute("data-document-meta", "true")
      document.getElementsByTagName('head')[0].appendChild(newMetaTag)
    })
  } else {
    _serverMeta = _.map(metaTags, (properties, nameOrProperty) => {
      let {name, property, content} = properties
      if(name)
        return `<meta name="${name}" data-document-meta="true" content="${content}" />`
      else if(property)
        return `<meta property="${property}" data-document-meta="true" content="${content}" />`
    }).join("") || null
  }
}, {
  displayName: "DocumentMeta",

  statics: {
    peek: function () {
      return _serverMeta
    },

    rewind: function () {
      var meta = _serverMeta
      this.dispose()
      return meta
    }
  },
}, function render() {
  return null
})
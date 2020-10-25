import React from 'react'

export function PostCard(props) {
  const {
    postPath,
    title,
    authors,
    abstract,
    createdAt,
    updatedAtInWords,
  } = props

  // console.log('post', post)

  // const updatedAt = () => {
  //   return updatedAtInWords !== null
  //     ? `Last updated ` + updatedAtInWords + ` ago`
  //     : ''
  // }

  // return (
  //   <div>
  //     <a href={postPath}>
  //       <div className="post-row">
  //         <h4 className="title">{title}</h4>
  //         <p className="authors">{authors}</p>
  //         <p className="preview">{abstract}</p>
  //         <p className="date">
  //           <span>Added on {createdAt}</span>
  //           <span className="ml-3">{updatedAt()}</span>
  //         </p>
  //       </div>
  //     </a>
  //   </div>
  // )

  return (
    <>
      <a href={postPath}>
        <div className="post-row">
          <h4 className="title">{title}</h4>
          <p className="authors">{authors}</p>
          <p className="preview">{abstract}</p>
          <p className="date">
            <span>Added on {createdAt}</span>
            <span className="ml-3">Updated at {updatedAtInWords} ago</span>
          </p>
        </div>
      </a>
    </>
  )
}

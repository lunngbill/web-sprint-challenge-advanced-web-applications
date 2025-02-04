import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm(props) {
    const [values, setValues] = useState(initialFormValues);
    const { postArticle, updateArticle, setCurrentArticleId, currentArticle } = props;

    const resetForm = () => setValues(initialFormValues);

    // Update form values when currentArticle changes
    useEffect(() => {
        if (currentArticle) {
            setValues({
                title: currentArticle.title || '',
                text: currentArticle.text || '',
                topic: currentArticle.topic || '',
            });
        } else {
            resetForm(); // Reset for create mode
        }
    }, [currentArticle]);

    const onChange = evt => {
        const { id, value } = evt.target;
        setValues({ ...values, [id]: value });
    };

    const onSubmit = evt => {
        evt.preventDefault();
        const action = currentArticle 
        ? () => updateArticle({ article_id: currentArticle.article_id, article: values}) 
        : () => postArticle(values);

        action()
            .then(() => {
                resetForm(); // Reset the form after successful submission
                setCurrentArticleId(null)
            })
            .catch(err => {
                console.error("Submission error:", err); // Handle errors appropriately
            });
    };

    const isDisabled = () => {
        return !(values.title && values.text && values.topic); // Disable if any input is empty
    };

    const cancelEdit = evt => {
        evt.preventDefault(); // Prevent form submission
        resetForm();
        setCurrentArticleId(null); // Clear the current article ID
    };

    return (
        <form id="form" onSubmit={onSubmit}>
            <h2>{currentArticle ? 'Edit Article' : 'Create Article'}</h2>
            <input
                maxLength={50}
                onChange={onChange}
                value={values.title}
                placeholder="Enter title"
                id="title"
            />
            <textarea
                maxLength={200}
                onChange={onChange}
                value={values.text}
                placeholder="Enter text"
                id="text"
            />
            <select onChange={onChange} id="topic" value={values.topic}>
                <option value="">-- Select topic --</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={cancelEdit}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}

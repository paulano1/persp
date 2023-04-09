import React from "react";
import correct from './correct.svg'
import './quiz.css'

interface QuizContainerProps {
    question : string;
    options : string[];
    answer : string;
}

export const QuizContainer = ({question, options, answer} : QuizContainerProps) => {
    const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
    return (
        <div className="QuizContainer" style={{
            background: selectedOption === answer ? 'linear-gradient(153.88deg, #FFFFFF -0.81%, #DDF1FF 13.03%, #4FE88C 77.93%)' : 'linear-gradient(153.88deg, #FFFFFF -0.81%, #DDF1FF 13.03%, #A5D9FE 77.93%)'
        }}>
            <div className="QuizContainer-question">{question}</div>
            {
                selectedOption === answer && <div
                style={{
                    display: 'flex',
                    backgroundColor: '#4176FD',
                    padding: '10px',
                    marginLeft: '30%',
                    marginRight: '30%',
                    borderRadius: '1rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
                > +45 Purrs!!</div>
            }
            <div className="QuizContainer-options">
                {options.map((option) => {
                    return (
                        <div className={`QuizContainer-option ${selectedOption === answer ? 'QuizContainer-option-correct' : ''}`} style={{
                        }}>
                            <input type="radio" name="option" value={option} onChange={(e) => {
                                setSelectedOption(e.currentTarget.value)
                            }}
                            disabled={selectedOption === answer}
                            />
                            <label>{option}</label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
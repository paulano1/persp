#**************** IMPORT PACKAGES ********************

import numpy as np
import pytesseract as pt
import pdf2image
from fpdf import FPDF
import re
import nltk
from nltk.tokenize import sent_tokenize
from nltk.tokenize import word_tokenize
import os
import pdfkit
import yake
from transformers import AutoTokenizer, AutoModelForPreTraining, AutoModel, AutoConfig
from summarizer import Summarizer,TransformerSummarizer
from transformers import pipelines
#nltk.download('punkt')

print("lets go")





# def allowed_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



#model_name = 'laxya007/gpt2_legal'
#model_name = 'facebook/bart-large-cnn'
model_name = 'nlpaueb/legal-bert-base-uncased'




print("lets go")

custom_config = AutoConfig.from_pretrained(model_name)
custom_config.output_hidden_states=True
custom_tokenizer = AutoTokenizer.from_pretrained(model_name)
custom_model = AutoModel.from_pretrained(model_name, config=custom_config)
bert_legal_model = Summarizer(custom_model=custom_model, custom_tokenizer=custom_tokenizer)
print('Using model {}\n'.format(model_name))




def processText(number, text):
    # if request.method == 'GET':
        # Get the file from post request

        numsent = int(number)
        # text = str(request.args['text'])
        content = text


        summary_text = ""
        for i, paragraph in enumerate(content.split("\n\n")):
            
            paragraph = paragraph.replace('\n',' ')
            paragraph = paragraph.replace('\t','')
            paragraph = ' '.join(paragraph.split())
            # count words in the paragraph and exclude if less than 4 words
            tokens = word_tokenize(paragraph)
            # only do real words
            tokens = [word for word in tokens if word.isalpha()]
            # print("\nTokens: {}\n".format(len(tokens)))
            # only do sentences with more than 1 words excl. alpha crap
            if len(tokens) <= 1:
                continue
            # Perhaps also ignore paragraphs with no sentence?
            sentences = sent_tokenize(paragraph)
            
            paragraph = ' '.join(tokens)

            print("\nParagraph:")
            print(paragraph+"\n")
            # T5 needs to have 'summarize' in order to work:
            # text = "summarize:" + paragraph
            text = paragraph
            
            summary = bert_legal_model(text,  min_length = 8, ratio = 0.05)
            # summary = tokenizer_t5.decode(summary_ids[0], skip_special_tokens=True)
            summary_text += str(summary) + "\n\n"
            print("Summary:")
            print(summary)

        content2 = content.replace('\n',' ')
        content2 = content2.replace('\t','')
        summary = bert_legal_model(content2, min_length = 8, num_sentences=25)
        


        # write all to file for inspection and storage
        all_text = "The Summary-- " + str(summary) + "\n\n\n" \
            + "The Larger Summary-- " + str(summary_text)
            

        all_text2 = all_text.encode('latin-1', 'replace').decode('latin-1')
        all_text2 = all_text2.replace('?','.')
        all_text2 = all_text2.replace('\n',' ')
        all_text2 = all_text2.replace('..','.')
        all_text2 = all_text2.replace(',.',',')
        all_text2 = all_text2.replace('-- ','\n\n\n')

        pdf = FPDF()  

        # Add a page
        pdf.add_page()

        pdf.set_font("Times", size = 12)

        # open the text file in read mode
        f = all_text2

        # insert the texts in pdf
        pdf.multi_cell(190, 10, txt = f, align = 'C')


        # save the pdf with name .pdf
        pdf.output("./static/legal.pdf")  
        print (all_text)

        
        # return render_template('results.html')
        return all_text, all_text2






import random 
import os
from text_to_speech_script import text_to_speech as speak
import glob
import chardet
import re

# Prints a block of lines from a file, centered around a specified line number.
def quote(file, lineNumber, around_Center):
    # Start the quote with a double quote character
    toPrint = r'"'
    # Append lines before the central line
    for i in range(-around_Center, around_Center):
        toPrint += file[lineNumber + i] + "\n"
    # Append the central line and close the quote
    toPrint += file[lineNumber + around_Center] + r'"' + "\n"
    print(toPrint)
    
# Checks whether a given input represents an integer number.
def is_integer(n):
    try:
        float(n)
    except ValueError:
        return False
    else:
        return float(n).is_integer()

# Recursively prompts for input until a valid integer is provided.
def intput(g = ""):
    i = input(g)
    if is_integer(i):
        return int(i)
    else:
        return intput()
         
# Returns a random index within the range of the global EHpairs list.
def getRandomWordIndex():
    return random.randint(0, len(EHpairs) - 1)

# Chooses a random English-Hebrew word pair along with its index.
def randCouple():
    index = getRandomWordIndex()
    return (EHpairs[index], index)

# Clears the terminal screen (works on Windows using 'cls').
def clear():
    os.system('cls')

# Displays a quiz question when the prompt is in English, providing Hebrew options.
def engquest(eng, heb, numberOptions, finalOptions):
    # Show the English word and instruct the user
    print(r'"' + eng + r'"' + "\nmeans in hebrew:  (Clue = Enter 0)\n")
    # List the Hebrew options (reversed to account for terminal display quirks)
    for i in range(1, numberOptions + 1):
        print(i, finalOptions[i - 1][1][::-1])
    print()
    # Use text-to-speech to speak the English word aloud
    speak(eng)

# Displays a quiz question when the prompt is in Hebrew, providing English options.
def hebquest(eng, heb, numberOptions, finalOptions):
    # Show the Hebrew word and instruct the user
    print(r'"' + heb + r'" ' + "\nמשמעותו באנגלית:  (Clue = Enter 0)\n")
    # List the English options
    for i in range(1, numberOptions + 1):
        print(i, finalOptions[i - 1][0])
    print()

# Reads subtitle files from a designated folder, cleans their content, and stores each file's lines.
def make_lines_filenames():
    global lines_filenames
    # Folder path pattern to locate .SRT subtitle files
    folder_path = 'C:/Users/Ofir Gaash/Desktop/LEARN/SUBS_DATA/*.SRT'
    
    # Initialize the list; each element will be a list containing the filename followed by its lines.
    lines_filenames = []

    # Loop through every .srt file found in the folder
    for srtFile in glob.glob(folder_path):
        srtFileName, _ = os.path.splitext(os.path.basename(srtFile))
        lines_filenames.append([srtFileName])

        # Detect the file encoding using chardet for accurate reading
        with open(srtFile, 'rb') as file2:
            raw_data = file2.read()
            result = chardet.detect(raw_data)
            encoding = result['encoding']

        # Open and read the file with the detected encoding, replacing errors if needed
        with open(srtFile, 'r', encoding=encoding, errors='replace') as file:
            # Process each line in the subtitle file
            for line in file.readlines():
                line = line.replace("\n", "")
                # Remove any HTML-like tags
                line = re.sub(r"<[^>]+>", "", line)
                # Add the line if it's not empty, not a timestamp, and not just a number
                if line != "" and "-->" not in line and not line.isnumeric():
                    lines_filenames[-1].append(line)

# Reads word pairs from a file and stores them in the global EHpairs list.
def makeWordPairs():
    global EHpairs
    EHpairs = []
    # Open the words file (assumed to be in UTF-8 encoding)
    with open('C:/Users/Ofir Gaash/Desktop/LEARN/words.txt', encoding="utf8") as wordsfile:
        # Process each line into an English-Hebrew tuple (split by comma)
        for line in wordsfile.readlines():
            line = line.replace("\n", "")
            EHpairs.append(tuple(line.split(",")))
            
# Main function that initializes data and starts the quiz.
def main():
    global wrongs
    wrongs = []  # List to store wrongly answered word pairs
    makeWordPairs()         # Build the list of word pairs
    make_lines_filenames()  # Build the list of subtitle lines
    ask(1)                  # Begin the quiz loop with initial settings
    
# The core game loop that generates questions, evaluates responses, and provides hints.
def ask(firstrun = 0):
    global numberOptions, lang, around_Center
    clear()  # Clear the screen for a fresh start
    
    # On the first run or when the user opts to reconfigure settings
    if firstrun:
        print("how many options in each question?")
        numberOptions = intput()
        clear()
        print("Enter 1 for English word and Hebrew options\nEnter 2 for Hebrew word and English options\n")
        print("you can change that later by entering 9\n")
        lang = intput()
        clear()
        print("how many lines around a quote?")
        around_Center = intput()
        firstrun = 0
        
    # Adjust number of options if not enough word pairs remain
    if len(EHpairs) < numberOptions:
        if len(EHpairs) == 0:
            print("you won!")
            # Print all the word pairs that were answered incorrectly
            for i in wrongs:
                print(i[0][0], i[0][1])
            input()
            return
        else:
            numberOptions = len(EHpairs)
    clear()
    
    # Display remaining words count
    print("number of words left to kill:", len(EHpairs), "\n\n")
    couple = randCouple()  # Select a random word pair
    eng = couple[0][0]     # Extract the English word
    heb = couple[0][1]     # Extract the Hebrew word
    heb = heb[::-1]        # Reverse the Hebrew word (for display compatibility)
    coupleIndex = couple[1]
    
    # Choose distinct indexes to create a list of options including the correct answer
    fourIndexes = [coupleIndex]
    while len(fourIndexes) < numberOptions:
        anotherIndex = getRandomWordIndex()
        if anotherIndex not in fourIndexes:
            fourIndexes.append(anotherIndex)
    
    # Build a temporary list of candidate options using the selected indexes
    tempOptions = []
    finalOptions = []
    for index in fourIndexes:
        tempOptions.append(EHpairs[index])
    # Randomize the order of options
    while len(finalOptions) < numberOptions:
        randOption = tempOptions[random.randint(0, numberOptions - 1)]
        if randOption not in finalOptions:
            finalOptions.append(randOption)
    
    # Display the question based on the chosen language mode
    if lang == 2:
        hebquest(eng, heb, numberOptions, finalOptions)
    else:
        engquest(eng, heb, numberOptions, finalOptions)
    
    # Get the user's answer as an integer
    userAnswer = intput()
    # Allow changing settings if user enters 9
    if userAnswer == 9:
        ask(1)
        
    # Check if the answer is correct (and not the clue option)
    if finalOptions[userAnswer - 1][0] == eng and userAnswer != 0:
        print("\n\ncorrect!")
        input()
        # Remove the correctly answered word from the list
        EHpairs.pop(coupleIndex)
    else:
        print("\nwrong...\n\n")
        wrongs.append(couple)  # Record the mistake
        
        # Prepare the English word in lowercase for further processing
        low = eng.lower()
        
        # Attempt to remove common suffixes to get the base form of the word
        for symb in ["eusly", "eus", "ing", "ied", "es", "er", "ed", "al", "ly", "s", "y", "d", "e"]:
            if low[0:-len(symb)] + symb == low:
                low = low[0:-len(symb)]
                break
        
        noResults = 1  # Flag to check if any matching lines were found
        searchedqual1 = 0
        searchedqual2 = 0
            
        # Loop to search through subtitle files for context lines containing the word
        while True:     
            # Iterate over each subtitle file (list of lines)
            for file in lines_filenames:
                # Process each line in the file after cleaning punctuation from word ends
                for lineNumber in range(len(file)):
                    wordsInLine = file[lineNumber].lower().split()
                    for i in range(len(wordsInLine)):
                        # Remove trailing non-alphabetic characters from each word
                        while not wordsInLine[i][-1].isalpha():
                            wordsInLine[i] = wordsInLine[i][0:-1]
                            if wordsInLine[i] == "":
                                break
                    
                    found = 0
                    qual = 0
                    # Check for the original word with various possible punctuation/suffixes
                    for mark in ["", "?", "!", "?!", ",", ".", "...", "s", "es", "eus", "ing", "er", "y", "ly", "eusly", "d", "ed", "al"]:
                        if eng.lower() + mark in wordsInLine:
                            found = 1
                            if mark in ["?", "!", "?!", ",", ".", "", "...", ""]:
                                qual = 1
                                searchedqual1 = 1
                                break
                            else:
                                qual = 2
                        else:
                            # Also try matching the base form of the word
                            if low + mark in wordsInLine:
                                found = 1
                                qual = 2  
                    
                    # If a match is found, display a quote from the subtitle file
                    if found:
                        if qual == 1:
                            print("1: direct result")
                            quote(file, lineNumber, around_Center)
                        elif searchedqual1:
                            print("2: result + additionals")
                            searchedqual2 = 1
                            quote(file, lineNumber, around_Center)
                        noResults = 0
            
            # Break the search loop if any results were found
            if searchedqual1 or searchedqual2:
                break
            else:
                searchedqual1 = 1
                
        # If still no results found, try a less direct search
        if noResults:
            for file in lines_filenames:    
                for lineNumber in range(len(file)):
                    if file[lineNumber].find(eng) != -1:
                        print("3: undirect result")
                        quote(file, lineNumber, around_Center)          
        
        # Prompt the user to guess again or to see the answer
        guess = intput(("\n\ntry again (if you still don't know, enter 0)\n"))
        
        if finalOptions[int(guess) - 1][0] == eng and guess != 0:
            print("\n\ncorrect!\n\n" + eng + " = " + heb)
            input()
        else:
            clear()
            print("\n\nthe answer is:\n" + eng + " = " + heb)
            input()
    
    # Continue the quiz loop
    ask()
    
# Start the application by calling main
main()

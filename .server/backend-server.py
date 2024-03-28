from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)
script = 'temp_script.py'

@app.route('/run_script', methods=['POST'])
def run_script():
    script_content = request.json.get('script_content')
    if script_content:
        # Save the script content to a temporary file
        with open(script, 'w') as f:
            f.write(script_content)
        
        # Run the script and capture the output
        try:
            output = subprocess.check_output(['python', 'temp_script.py'], stderr=subprocess.STDOUT, universal_newlines=True)
        except subprocess.CalledProcessError as e:
            output = e.output
        
        # Remove the temporary file
        os.remove(script)
        
        return jsonify({'output': output})
    else:
        return jsonify({'error': 'No script content provided'}), 400

if __name__ == '__main__':
    app.run(debug=False)

#author: sgurin
#For install this, first fix the nodePath and indentjsFolderPath according to your system
#then in sublime 2 goto Tools->new Plugin and there type copy and paste this file
and for using it, select the javascript code you want to indent and goto View->Show Console and there type view.run_command('jsindentator') and enter


import sublime, sublime_plugin, subprocess, os; 

class JsindentatorCommand(sublime_plugin.TextCommand):  
    def run(self, edit):  
        #self.view.insert(edit, 0, "Hello, World!")        
        nodePath = "c:\\Program Files\\nodejs\\node.exe"; 
        indentjsFolderPath = "C:\\Users\\sgurin\\Desktop\\js-indentator\\jsindentator"; 
        indentjsPath = indentjsFolderPath + "\\indent.js"
        indentjsOutputPath = indentjsFolderPath+"\\jsindentator_output.txt"
        indentjsInputPath = indentjsFolderPath+"\\jsindentator_input.txt"

        for region in self.view.sel():  
            if not region.empty():  

                selection = self.view.substr(region) 

                outputFile = open(indentjsOutputPath, 'w')
                outputFile.write(selection)
                outputFile.close()

                os.chdir(indentjsFolderPath)
                subprocess.call([nodePath, indentjsPath, " ", indentjsOutputPath])

                outputCode = open(indentjsOutputPath, 'r').read()
                self.view.replace(edit, region, outputCode)
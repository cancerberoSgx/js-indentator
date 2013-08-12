import sublime, sublime_plugin, subprocess, os; 


class ExampleCommand(sublime_plugin.TextCommand):  
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
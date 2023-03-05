# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
from threading import Thread

hostName = "localhost"
serverPort1 = 8080 # pdf port
serverPort2 = 8090 # smile port
serverPort3 = 8100 # blank screen port

class MyServerPDF(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Content-type", "application/pdf")
        self.end_headers()
        file = open("./localServer/mainPdf.pdf", "rb")
        self.wfile.write(file.read())
        # self.wfile.write(bytes("<html><head><title>https://pythonbasics.org</title></head>", "utf-8"))
        # self.wfile.write(bytes("<p>Request: %s</p>" % self.path, "utf-8"))
        # self.wfile.write(bytes("<body>", "utf-8"))
        # self.wfile.write(bytes("<p>This is an example web server.</p>", "utf-8"))
        # self.wfile.write(bytes("</body></html>", "utf-8"))


class MyServerSmile(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Content-type", "image/png")
        self.end_headers()
        file = open("./localServer/smile.png", "rb")
        self.wfile.write(file.read())


class MyServerBlank(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Content-type", "image/png")
        self.end_headers()
        file = open("./localServer/blank.png", "rb")
        self.wfile.write(file.read())

def startServer(webServer):
    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()




if __name__ == "__main__":        
    webServerPDF = HTTPServer((hostName, serverPort1), MyServerPDF)
    webServerSmile = HTTPServer((hostName, serverPort2), MyServerSmile)
    webServerBlank = HTTPServer((hostName, serverPort3), MyServerBlank)
    # print("Server started http://%s:%s" % (hostName, serverPort1))

    pdfThread = Thread(target=lambda: startServer(webServerPDF))
    smileThread = Thread(target = lambda: startServer(webServerSmile))
    blankThread = Thread(target = lambda: startServer(webServerBlank))

    pdfThread.start()
    smileThread.start()
    blankThread.start()
    

    

    # print("Server stopped.")